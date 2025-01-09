import { WebContainer } from "@webcontainer/api";

let webcontainerInstance = null;
// Call only once
export const getWebContainer = () => {
  if (webcontainerInstance === null) {
    webcontainerInstance = new WebContainer()
  }
  return webcontainerInstance;
};
