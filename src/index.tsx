const React = require("react");
const ReactDOM = require("react-dom");
import App from "./react/org-chart";
const fakeData = require("./utils/fake-data");

const root = document.getElementById("root");
const tree = fakeData();

const props = {
  tree: {
    id: 1,
    person: {
      id: 1,
      avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/spbroma/128.jpg",
      department: "",
      name: "Imelda Haley",
      title: "CEO",
      totalReports: 5
    },
    hasChild: true,
    children: []
  },
  loadChildren: (d: any) => {
    // this could also just be `return tree.children`
    return Promise.resolve(tree.children);
  },
  lineType: "curve"
};

ReactDOM.render(React.createElement(App, props, null), root);
