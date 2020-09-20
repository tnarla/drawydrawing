import { types } from "mobx-state-tree";

const Pen = types
  .model({
    color: "#f94144",
    size: 5,
  })
  .actions((self) => ({
    setColor: (color: string) => (self.color = color),
    setSize: (size: number) => (self.size = size),
  }));

const Store = types.model({
  pen: Pen,
});

export const store = Store.create({
  pen: {},
});
