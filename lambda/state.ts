import { Provider } from "./providers/IProvider";


export interface State {

}

export function getInitialState(dataProvider: Provider): State {
  console.log(dataProvider)
  return {}
}
