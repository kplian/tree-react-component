var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useEffect } from 'react';
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
var StyledTreeItem = styled(function (props) {
    var selected = props.selected, labelText = props.labelText, node = props.node, data = props.data, enableChecked = props.enableChecked, getOnChange = props.getOnChange, handleContextMenu = props.handleContextMenu, render = props.render, showOptions = props.showOptions, rest = __rest(props, ["selected", "labelText", "node", "data", "enableChecked", "getOnChange", "handleContextMenu", "render", "showOptions"]);
    var CheckboxTree = function (node, data) { return (React.createElement(Checkbox, { checked: selected.some(function (item) { return item === node.id; }), onClick: function (e) { return e.stopPropagation(); }, onChange: function (event) { return getOnChange(event.currentTarget.checked, node, data); } })); };
    return (React.createElement(TreeItem, __assign({}, rest, { 
        // TransitionComponent={TransitionComponent} 
        label: React.createElement(Box, { display: "flex", alignItems: "center", onContextMenu: handleContextMenu, style: { cursor: 'context-menu' } },
            enableChecked && React.createElement(CheckboxTree, { node: node, data: data }),
            !render ?
                React.createElement(Typography, { sx: { fontWeight: 'inherit', flexGrow: 1 } }, labelText)
                : render(node),
            showOptions && React.createElement(IconButton, { onClick: function (e) { e.stopPropagation(); handleContextMenu(e); }, sx: { marginRight: 2 } },
                React.createElement(MoreVertIcon, null))) })));
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& ." + treeItemClasses.iconContainer] = {
            '& .close': {
                opacity: 0.3,
            },
        },
        _b["& ." + treeItemClasses.group] = {
            marginLeft: 15,
            paddingLeft: 18,
            borderLeft: "1px dashed " + alpha(theme.palette.text.primary, 0.4),
        },
        _b);
});
var CustomizedTreeView = function (_a) {
    var _b = _a.data, data = _b === void 0 ? [] : _b, _c = _a.enableChecked, enableChecked = _c === void 0 ? true : _c, options = _a.options, render = _a.render, onLoadChildren = _a.onLoadChildren, onSelectedNodes = _a.onSelectedNodes;
    var _d = React.useState([]), selected = _d[0], setSelected = _d[1];
    var _f = React.useState(null), contextMenu = _f[0], setContextMenu = _f[1];
    // //node is always the root "Parent"
    //id is id of node clicked
    function getChildById(data, id) {
        var array = [];
        //returns an array of nodes ids: clicked node id and all children node ids
        function getAllChild(nodes) {
            if (nodes === null)
                return [];
            array.push(nodes.id);
            if (Array.isArray(nodes.children)) {
                nodes.children.forEach(function (node) {
                    array = __spreadArray(__spreadArray([], array, true), getAllChild(node), true);
                    array = array.filter(function (v, i) { return array.indexOf(v) === i; });
                });
            }
            return array;
        }
        //returns the node object that was selected
        function getNodeById(nodes, id) {
            if (nodes.id === id) {
                return nodes;
            }
            else if (Array.isArray(nodes.children)) {
                var result_1 = null;
                nodes.children.forEach(function (node) {
                    if (!!getNodeById(node, id)) {
                        result_1 = getNodeById(node, id);
                    }
                });
                return result_1;
            }
            return null;
        }
        return getAllChild(getNodeById(data, id));
    }
    function getOnChange(checked, nodes, allData) {
        //gets all freshly selected or unselected nodes
        console.log('node', checked, allData, nodes);
        var allNode = getChildById(allData, nodes.id);
        //combines newly selected nodes with existing selection
        //or filters out newly deselected nodes from existing selection
        var array = checked
            ? __spreadArray(__spreadArray([], selected, true), allNode, true) : selected.filter(function (value) { return !allNode.includes(value); });
        setSelected(array);
    }
    var RenderChildren = function (node, allData) {
        var handleContextMenu = function (event) {
            event.preventDefault();
            setContextMenu(contextMenu === null
                ? {
                    mouseX: event.clientX - 2,
                    mouseY: event.clientY - 4,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                    // Other native context menus might behave different.
                    // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                    null);
        };
        return (React.createElement(StyledTreeItem, { key: node.id, nodeId: String(node.id), getOnChange: getOnChange, handleContextMenu: handleContextMenu, node: node, labelText: node.label, selected: selected, data: allData, enableChecked: enableChecked, render: render, showOptions: !!options }, Array.isArray(node.children)
            ? node.children.map(function (node) { return RenderChildren(node, allData); })
            : (node.load ? null : React.createElement("div", { key: "stub" }))));
    };
    var handleClose = function () {
        setContextMenu(null);
    };
    useEffect(function () {
        onSelectedNodes && onSelectedNodes(selected);
    }, [selected]);
    return (React.createElement(TreeView, { "aria-label": "pxp-tree", defaultExpanded: ['1'], defaultCollapseIcon: React.createElement(FolderIcon, { color: "warning" }), defaultExpandIcon: React.createElement(FolderOpenIcon, { color: "warning" }), defaultEndIcon: React.createElement(InsertDriveFileIcon, { color: "info" }), onNodeToggle: function (e, nodes) { console.log(e, nodes); }, onNodeSelect: function (_e, node) { return onLoadChildren ? onLoadChildren(node) : null; }, sx: { height: 500, flexGrow: 1, maxWidth: 500, overflowY: 'auto' } },
        data.length > 0 && data.map(function (node) { return RenderChildren(node, node); }),
        React.createElement(Menu, { open: contextMenu !== null, onClose: handleClose, anchorReference: "anchorPosition", anchorPosition: contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined }, options === null || options === void 0 ? void 0 : options.map(function (menu) {
            var MenuIcon = menu.icon;
            return (React.createElement(MenuItem, { onClick: menu.onClick, key: menu.label + '_option' },
                React.createElement(ListItemIcon, null, typeof menu.icon === 'string' ? React.createElement(Icon, null, menu.icon)
                    : React.createElement(MenuIcon, null)),
                React.createElement(ListItemText, null, menu.label)));
        }))));
};
export default CustomizedTreeView;
