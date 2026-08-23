---
title: "Update"
nav:
  position: 50
---

# Update

With `data.update` you can update datasets from the Contena Administration. [The data handling guide](../../concepts/datahandling.md) explains how to find available datasets.

## data.update()

`update()` sends new data for a registered dataset to the Contena Administration.

#### Usage

```ts
import { data } from "@contena/meteor-admin-sdk";

data
  .update({
    id: "ct-product-detail__product",
    data: {
      name: "My updated name",
    },
  })
  .then(() => {
    console.log("success");
  });
```

#### Parameters

| Name      | Required | Description                                        |
| :-------- | :------- | :------------------------------------------------- |
| `options` | true     | An object containing the id and the data to update |

#### Return value

Returns a promise without data.
