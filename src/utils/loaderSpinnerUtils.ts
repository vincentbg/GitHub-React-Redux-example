import { Oval } from "react-loader-spinner";
import { Status } from "../utils/enumeration";

export interface LoaderSpinner {
  Component: React.FunctionComponent<any>;
  props: { color: string; height: number; width: number };
  name: string;
}
export const data = [
  {
    Component: Oval,
    props: {
      color: "#0c6832",
      height: 42,
      width: 47,
    },
    name: Status.Loading,
  },
];
