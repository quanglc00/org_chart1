import * as d3 from "d3";
const { collapse, wrapText, helpers } = require("../utils");
const defineBoxShadow = require("../defs/box-shadow");
const defineAvatarClip = require("../defs/avatar-clip");
const render = require("./render");
const renderUpdate = require("./render-update");
const defaultConfig = require("./config");

export default function init(options) {
  // Merge options with the default config
  const config = {
    ...defaultConfig,
    ...options,
    treeData: options.data
  };

  if (!config.id) {
    return;
  }

  const {
    id,
    treeData,
    lineType,
    margin,
    nodeWidth,
    nodeHeight,
    nodeSpacing,
    shouldResize
  } = config;

  // Calculate how many pixel nodes to be spaced based on the
  // type of line that needs to be rendered
  if (lineType === "angle") {
    config.lineDepthY = nodeHeight + 40;
  } else {
    config.lineDepthY = nodeHeight + 60;
  }

  // Get the root element
  const elem = document.querySelector(id);
  if (!elem) {
    return;
  }
  console.log(config);
  // Reset in case there's any existing DOM
  elem.innerHTML = "";

  const elemWidth = elem.offsetWidth;
  const elemHeight = elem.offsetHeight;

  // Setup the d3 tree layout
  config.tree = d3.layout
    .tree()
    .nodeSize([nodeWidth + nodeSpacing, nodeHeight + nodeSpacing]);

  // Calculate width of a node with expanded children
  const childrenWidth = parseInt(
    (treeData.children.length * nodeWidth) / 2,
    10
  );

  // Add svg root for d3
  const svgroot = d3
    .select(id)
    .append("svg")
    .attr("width", elemWidth)
    .attr("height", elemHeight);

  // Add our base svg group to transform when a user zooms/pans
  const svg = svgroot
    .append("g")
    .attr(
      "transform",
      "translate(" +
        parseInt(
          childrenWidth + (elemWidth - childrenWidth * 2) / 2 - margin.left / 2,
          10
        ) +
        "," +
        20 +
        ")"
    );

  // Define box shadow and avatar border radius
  defineBoxShadow(svgroot, "boxShadow");
  defineAvatarClip(svgroot, "avatarClip", {
    borderRadius: 40
  });

  // Center the viewport on initial load
  treeData.x0 = 0;
  treeData.y0 = elemHeight / 2;

  // Collapse all of the children on initial load
  treeData.children.forEach(collapse);

  // Connect core variables to config so that they can be
  // used in internal rendering functions
  config.svg = svg;
  config.svgroot = svgroot;
  config.render = render;

  // Defined zoom behavior
  const zoom = d3.behavior
    .zoom()
    // Define the [zoomOutBound, zoomInBound]
    .scaleExtent([0.4, 2])
    .duration(50)
    .on("zoom", renderUpdate(config));

  // Attach zoom behavior to the svg root
  svgroot.call(zoom);

  // Define the point of origin for zoom transformations
  zoom.translate([
    parseInt(
      childrenWidth + (elemWidth - childrenWidth * 2) / 2 - margin.left / 2,
      10
    ),
    20
  ]);

  // Add listener for when the browser or parent node resizes
  const resize = () => {
    if (!elem) {
      global.removeEventListener("resize", resize);
      return;
    }

    svgroot.attr("width", elem.offsetWidth).attr("height", elem.offsetHeight);
  };

  if (shouldResize) {
    global.addEventListener("resize", resize);
  }

  // Start initial render
  render(config);

  // Update DOM root height
  d3.select(id).style("height", elemHeight + margin.top + margin.bottom);
}
