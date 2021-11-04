import { CommitAction } from "./action_parser";

type SortPriority = [name: string, priority: number];

const sortOrder: SortPriority[] = [
  ['feat'  , 1],
  ['chg'   , 2],
  ['fix'   , 3],
  ['docs'  , 4],
  ['chore' , 10]
];


export function sortActions(actions: CommitAction[]) {
  actions.sort((a, b) => {
    const a1 = findOrder(a.name);
    const b1 = findOrder(b.name);
    return a1[1] - b1[1];
  });
}


function findOrder(name: string) {
  return sortOrder.find(v => v[0] == name) ?? ['', sortOrder.length + 1];
}