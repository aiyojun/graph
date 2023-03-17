# `graph-engine`

> The powerful graph engine.

## Usage

```typescript
import { Graph } from 'graph-engine'

// Create and mount the default theme graph:
const graph = new Graph()
    .mount(document.getElementById('root'))

// Create a node without any in/out ports:    
const node = graph.createNode({ x: 0, y: 0, w: 100, h: 40 })

// More functions please refer to documentation ...
    
```
