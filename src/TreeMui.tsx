import React, { FC, useEffect } from 'react';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// web.cjs is required for IE11 support
// import { useSpring, animated } from 'react-spring';
// import { TransitionProps } from '@mui/material/transitions';
import { Checkbox, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import { IPxpTree, IOption } from './interfaces';
import Icon from '@mui/material/Icon';

// function TransitionComponent(props: TransitionProps) {
//   const style = useSpring({
//     from: {
//       opacity: 0,
//       transform: 'translate3d(20px,0,0)',
//     },
//     to: {
//       opacity: props.in ? 1 : 0,
//       transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
//     },
//   });

//   return (
//     <animated.div style={style}>
//       <Collapse {...props} />
//     </animated.div>
//   );
// }

const StyledTreeItem = styled((props: any) => {
  const {selected, labelText, node, data, enableChecked, getOnChange, handleContextMenu, render, showOptions, ...rest } = props;

  const CheckboxTree = (node: any, data: any) =>(
    <Checkbox 
      checked={selected.some((item: any) => item === node.id)}
      onClick={(e) => e.stopPropagation()}
      onChange={(event) => getOnChange(event.currentTarget.checked, node, data)}
    />
  );
  return (
  <TreeItem 
    {...rest} 
    // TransitionComponent={TransitionComponent} 
    label={
      <Box display="flex" alignItems="center" onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
        { enableChecked && <CheckboxTree node={node} data={data} />}
        { !render ? 
          <Typography sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          :  render(node)
        }
        {
          showOptions && <IconButton 
            onClick={(e) => {e.stopPropagation(); handleContextMenu(e)}}
            sx={{ marginRight: 2 }}
          >
            <MoreVertIcon/>
          </IconButton>
        }        
      </Box>
    }    
  />
)})(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const CustomizedTreeView: FC<IPxpTree> = ({data = [], enableChecked= true, options, render, onLoadChildren, onSelectedNodes}) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [contextMenu, setContextMenu] = React.useState<{
      mouseX: number;
      mouseY: number;
    } | null>(null);
  // //node is always the root "Parent"
  //id is id of node clicked
  function getChildById(data: any, id: string) {
    let array: string[] = [];

    //returns an array of nodes ids: clicked node id and all children node ids
    function getAllChild(nodes: any | null) {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node: any) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    //returns the node object that was selected
    function getNodeById(nodes: any, id: any) {
      if (nodes.id === id) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node: any) => {
          if (!!getNodeById(node, id)) {
            result = getNodeById(node, id);
          }
        });
        return result;
      }

      return null;
    }

    return getAllChild(getNodeById(data, id));
  }

  function getOnChange(checked: boolean, nodes: any, allData: any) {
    //gets all freshly selected or unselected nodes
    console.log('node', checked, allData, nodes);
    
    const allNode: any[] = getChildById(allData, nodes.id);
    //combines newly selected nodes with existing selection
    //or filters out newly deselected nodes from existing selection
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter((value) => !allNode.includes(value));

    setSelected(array);
  }

  const RenderChildren = (node: any, allData: any) => {
    const handleContextMenu = (event: React.MouseEvent) => {
      event.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX - 2,
              mouseY: event.clientY - 4,
            }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
            // Other native context menus might behave different.
            // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null,
      );
    };

    return (
      <StyledTreeItem
        key={node.id}
        nodeId={String(node.id)}
        getOnChange={getOnChange} 
        handleContextMenu={handleContextMenu}
        node={node}
        labelText={node.label}
        selected={selected}
        data={allData}
        enableChecked={enableChecked}
        render={render}
        showOptions={!!options}
      >
        {Array.isArray(node.children)
          ? node.children.map((node: any) => RenderChildren(node, allData))
          : (node.load ? null: <div key="stub" />)}
      </StyledTreeItem>
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    onSelectedNodes && onSelectedNodes(selected);
  }, [selected])

  return (
    <TreeView
      aria-label="pxp-tree"
      defaultExpanded={['1']}
      defaultCollapseIcon={<FolderIcon color="warning"/>}
      defaultExpandIcon={<FolderOpenIcon color="warning"/>}
      defaultEndIcon={<InsertDriveFileIcon color="info"/>}
      onNodeToggle={(e, nodes)=>{console.log(e, nodes)}}
      onNodeSelect={(_e: any, node: any)=> onLoadChildren ? onLoadChildren(node) : null}
      sx={{ height: 500, flexGrow: 1, maxWidth: 500, overflowY: 'auto' }}
    >
      {
        data.length > 0 && data.map((node: any) => RenderChildren(node, node))
      }
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {
          options?.map((menu: IOption) => {
            const MenuIcon: any = menu.icon;
            return (
            <MenuItem onClick={menu.onClick} key={menu.label + '_option' }>
              <ListItemIcon>
                {
                  typeof menu.icon === 'string' ? <Icon>{menu.icon}</Icon>
                  : <MenuIcon />
                }
              </ListItemIcon>
              <ListItemText>{ menu.label}</ListItemText>
            </MenuItem>
          )})
        }
      </Menu>
    </TreeView>
  );
}

export default CustomizedTreeView;