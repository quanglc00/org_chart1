const { createElement, PureComponent } = require("react");
import init from "../chart/index.js"

export default class App extends PureComponent {
  render() {
    const { id } = this.props;

    return createElement("div", {
      id
    });
  }

  static defaultProps = {
    id: "react-org-chart"
  };

  componentDidMount() {
    const { id, tree, ...options } = this.props;

    init({ id: `#${id}`, data: tree, ...options });
  }
}
