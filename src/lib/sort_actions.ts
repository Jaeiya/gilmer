
import { CommitAction } from "./action_parser";



type SortPriority = [name: string, priority: number];



const sortOrder: SortPriority[] = [
  ['feat'  , 1],
  ['chg'   , 2],
  ['fix'   , 3],
  ['docs'  , 4],
  ['chore' , 10]
];

const defaultOrder: SortPriority = ['', sortOrder.length + 1];


export function sortActions(actions: CommitAction[]) {
  actions.sort((a, b) => {
    const a1 = findPriority(a.name);
    const b1 = findPriority(b.name);
    return a1[1] - b1[1];
  });
}

function findPriority(name: string) {
  return sortOrder.find(v => v[0] == name) ?? defaultOrder;
}