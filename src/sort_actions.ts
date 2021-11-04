import { CommitAction } from "./action_parser";

type SortPriority = [name: string, priority: number];

const sortOrder: SortPriority[] = [
  ['feat'  , 1],
  ['chg'   , 2],
  ['fix'   , 3],
  ['clean' , 4],
  ['docs'  , 5],
  ['chore' , 6]
];


export function sortActions(actions: CommitAction[]) {
  actions.sort((a, b) => {
    const a1 = findOrder(a.name);
    const b1 = findOrder(b.name);
    return a1[1] - b1[1];
  });
}


function findOrder(name: string) {
  return sortOrder.find(v => v[0] == name) ?? ['', 0];
}