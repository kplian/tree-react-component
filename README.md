# React Tree Component
Tree component designed for @pxp-ui

## Installation
```
$ npm install @pxp-ui/tree
```

## Basic Usage
```typescript
import React, { useState } from 'react';
import Tree from '@pxp-ui/tree';

const App = () => {
  const [data, setData] = useState([{
        id: '1',
        label: 'Parent',
        children: [{
          id: '2',
          label: 'Child 1',
        }]
  }]);

  return(
    <TreeMui 
      data={data}
      onSelectedNodes={console.log}
      enableChecked
    />
  )
}

export default App;
```

## Props
Name | Type | Default | Description |
------------ | ------------- | ------------- | ------------- |
enableChecked | boolean | true | Show a checkbox, which allow select the tree item. |
data | Array<ILeaf> | [] | Initial tree data |
options | Array<IOption> | | Options events for custom menu. |
render | node | | The custom content of the tree item. |
onLoadChildren | function | | Callback fired when the tree item is selected the first time.  |
onSelectedNodes | function | | Callback fired when tree items are selected/unselected. |