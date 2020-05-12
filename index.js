/** @jsx h */
import { h, render } from "preact";
import { useMemo, useState, useCallback } from "preact/hooks";
import { createEditor, Transforms, Editor, Node, Text, Range } from "slate";
import { Slate, useSlate, Editable, withReact } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faExpand,
  faCompress,
  faUndo,
  faRedo,
  faPrint,
  faBold,
  faItalic,
  faParagraph,
  faHeading,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

import { ThemeProvider, useColorMode, Box, Button, Styled } from "theme-ui";

// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//import * as serviceWorker from "./serviceWorker.js";

const Colors = {
  gray: [
    "#fff",
    "#f8f9fa",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#adb5bd",
    "#6c757d",
    "#495057",
    "#343a40",
    "#212529",
    "#000",
  ],
  blue: "#0d6efd",
  indigo: "#6610f2",
  purple: "#6f42c1",
  pink: "#d63384",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "#28a745",
  teal: "#20c997",
  cyan: "#17a2b8",
};

const Themes = {
  flow: {
    initialColorMode: "light",

    colors: {
      text: Colors.gray[8],
      background: Colors.gray[0],
      primary: Colors.blue,
      secondary: Colors.gray[8],

      modes: {
        dark: {
          text: Colors.gray[0],
          background: Colors.gray[9],
          secondary: Colors.gray[4],
        },
      },
    },

    fonts: {
      body: "'Quicksand', Arial, Helvetica, sans-serif",
      heading: "inherit",
      monospace: "'Fira code', 'Courier New', Courier, monospace",
    },
    fontSizes: ["1rem", "1.25rem", "1.5rem", "1.75rem", "2rem", "2.5rem"],
    fontWeights: {
      light: 300,
      body: 400,
      heading: 500,
      bold: 700,
    },
    lineHeights: {
      body: 1.5,
      heading: 1.2,
    },

    space: ["0rem", "0.25rem", "0.5rem", "1rem", "1.5rem", "3rem"],
    breakpoints: [576, 768, 992, 1200, 1400],

    text: {
      heading: {
        fontFamily: "heading",
        fontWeight: "heading",
        lineHeight: "heading",
      },
    },
    buttons: {
      primary: {
        color: "primary",
        bg: "background",
        "&:hover, &:focus": {
          outline: 0,
        },
        "&:focus": {
          color: "background",
          bg: "primary",
        },
        "&:disabled": {
          opacity: 0.5,
        },
      },
      secondary: {
        color: "secondary",
        bg: "background",
        "&:hover, &:focus": {
          outline: 0,
        },
        "&:focus": {
          color: "background",
          bg: "secondary",
        },
        "&:disabled": {
          opacity: 0.5,
        },
      },
    },

    styles: {
      root: {
        fontFamily: "body",
        lineHeight: "body",
        fontWeight: "body",
      },
      p: {
        fontSize: 0,
      },
      h1: {
        variant: "text.heading",
        fontSize: 5,
      },
      h2: {
        variant: "text.heading",
        fontSize: 4,
      },
      h3: {
        variant: "text.heading",
        fontSize: 3,
      },
      h4: {
        variant: "text.heading",
        fontSize: 2,
      },
      h5: {
        variant: "text.heading",
        fontSize: 1,
      },
      h6: {
        variant: "text.heading",
        fontSize: 0,
      },
      div: {
        fontFamily: "monospace",
      },
      i: {
        fontWeight: "light",
      },
      b: {
        fontWeight: "bold",
      },
    },
  },
};

const FlowEditor = {
  // Define a serializing function that takes a value and
  // returns the string content of each node in the value's children
  // then joins them all with line breaks denoting paragraphs.
  serializePlainText(value) {
    return value.map((n) => Node.string(n)).join("\n");
  },

  // Define a deserializing function that takes a string and
  // returns a value as an array of children derived by splitting the string.
  deserializePlainText(string) {
    return string.split("\n").map((paragraph) => {
      return {
        children: [{ text: paragraph }],
      };
    });
  },

  isMarkActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n[format] === true,
    });

    return !!match;
  },

  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === format,
    });

    return !!match;
  },

  isAlignActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.align === format,
    });

    return !!match;
  },

  isSelectionActive(editor) {
    const { selection } = editor;
    return selection && !Range.isCollapsed(selection);
  },

  isfullscreenActive() {
    return !!(
      window.document.fullscreenElement ||
      window.document.mozFullScreenElement ||
      window.document.webkitFullscreenElement ||
      window.document.msFullscreenElement
    );
  },

  toggleMark(editor, format) {
    const active = FlowEditor.isMarkActive(editor, format);
    const selection = FlowEditor.isSelectionActive(editor);

    if (selection) {
      Transforms.setNodes(
        editor,
        {
          [format]: active ? null : true,
        },
        {
          match: (n) => Text.isText(n),
          split: true,
        }
      );
    }
  },

  toggleBlock(editor, format) {
    const active = FlowEditor.isBlockActive(editor, format);

    Transforms.setNodes(
      editor,
      {
        type: active ? null : format,
      },
      {
        match: (n) => Editor.isBlock(editor, n),
      }
    );
  },

  toggleAlign(editor, format) {
    const active = FlowEditor.isAlignActive(editor, format);

    Transforms.setNodes(
      editor,
      {
        align: active ? null : format,
      },
      {
        match: (n) => Editor.isBlock(editor, n),
      }
    );
  },

  toggleFullscreen() {
    const element = window.document.documentElement;

    if (FlowEditor.isfullscreenActive()) {
      if (window.document.exitFullscreen) {
        window.document.exitFullscreen();
      } else if (window.document.mozCancelFullScreen) {
        window.document.mozCancelFullScreen();
      } else if (window.document.webkitExitFullscreen) {
        window.document.webkitExitFullscreen();
      } else if (window.document.msExitFullscreen) {
        window.document.msExitFullscreen();
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
  },

  isOnMac() {
    return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  },

  print() {
    return window.print();
  },

  save(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  },

  load(key) {
    return (
      JSON.parse(window.localStorage.getItem(key)) || [
        { children: [{ text: "" }] },
      ]
    );
  },
};

const withFlow = (editor) => {
  return editor;
};

const Root = () => {
  const editor = useMemo(
    () => withFlow(withHistory(withReact(createEditor()))),
    []
  );
  const [value, setValue] = useState(FlowEditor.load("value"));

  const onChange = (value) => {
    setValue(value);
    FlowEditor.save("value", value);
  };

  return (
    <ThemeProvider theme={Themes.flow}>
      <Slate editor={editor} value={value} onChange={onChange}>
        <Flow>
          <Toolbox>
            <ActionButton
              icon="expand"
              label="Expand"
              mb={1}
              mr={1}
              action={(event) => {
                event.preventDefault();
                FlowEditor.toggleFullscreen();
              }}
            />
            <ActionButton
              disabled={editor.history.undos.length === 0}
              icon="undo"
              label="Undo"
              mb={1}
              mr={1}
              action={(event) => {
                event.preventDefault();
                HistoryEditor.undo(editor);
              }}
            />
            <ActionButton
              disabled={editor.history.redos.length === 0}
              icon="redo"
              label="Redo"
              mb={1}
              mr={1}
              action={(event) => {
                event.preventDefault();
                HistoryEditor.redo(editor);
              }}
            />
            <ActionButton
              icon="print"
              label="Print"
              mb={1}
              mr={1}
              action={(event) => {
                event.preventDefault();
                FlowEditor.print();
              }}
            />
            <MarkButton format="bold" icon="bold" label="Bold" mb={1} mr={1} />
            <MarkButton
              format="italic"
              icon="italic"
              label="Italic"
              mb={1}
              mr={1}
            />
            <BlockButton
              format="paragraph"
              icon="paragraph"
              label="Paragraph"
              mb={1}
              mr={1}
            />
            <BlockButton
              format="heading6"
              icon="heading"
              label="Heading 6"
              mb={1}
              mr={1}
            />
            <BlockButton
              format="heading5"
              icon="heading"
              label="Heading 5"
              mb={1}
              mr={1}
            />
            <BlockButton
              format="heading4"
              icon="heading"
              label="Heading 4"
              mb={1}
              mr={1}
            />
            <BlockButton
              format="heading3"
              icon="heading"
              label="Heading 3"
              mb={1}
              mr={1}
            />
            <BlockButton
              format="heading2"
              icon="heading"
              label="Heading 2"
              mb={1}
              mr={1}
            />
            <BlockButton
              format="heading1"
              icon="heading"
              label="Heading 1"
              mb={1}
              mr={1}
            />
            <AlignButton
              format="left"
              icon="align-left"
              label="Left"
              mb={1}
              mr={1}
            />
            <AlignButton
              format="center"
              icon="align-center"
              label="Center"
              mb={1}
              mr={1}
            />
            <AlignButton
              format="right"
              icon="align-right"
              label="Right"
              mb={1}
              mr={1}
            />
            <AlignButton
              format="justify"
              icon="align-justify"
              label="Justify"
              mb={1}
              mr={1}
            />
            <ColorSwitch mb={1} />
          </Toolbox>
          <Textbox />
        </Flow>
      </Slate>
    </ThemeProvider>
  );
};

const Flow = (props) => {
  const { children } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        "@media print": {
          display: "block",
        },
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const Leaf = (props) => {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <Styled.b>{children}</Styled.b>;
  }

  if (leaf.italic) {
    children = <Styled.i>{children}</Styled.i>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "paragraph":
      return (
        <Box
          as={Styled.p}
          mb={3}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
    case "heading1":
      return (
        <Box
          as={Styled.h1}
          mb={2}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
    case "heading2":
      return (
        <Box
          as={Styled.h2}
          mb={2}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
    case "heading3":
      return (
        <Box
          as={Styled.h3}
          mb={2}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
    case "heading4":
      return (
        <Box
          as={Styled.h4}
          mb={2}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
    case "heading5":
      return (
        <Box
          as={Styled.h5}
          mb={2}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
    case "heading6":
      return (
        <Box
          as={Styled.h6}
          mb={2}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
    default:
      return (
        <Box
          as={Styled.div}
          sx={{
            textAlign: element.align,
          }}
          {...attributes}
        >
          {children}
        </Box>
      );
  }
};

const Input = (props) => {
  const editor = useSlate();

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props) => {
    return <Element {...props} />;
  }, []);

  const onKeyDown = (event) => {
    const modKey = FlowEditor.isOnMac() ? event.metaKey : event.ctrlKey;

    if (modKey) {
      switch (event.key) {
        case "p":
          event.preventDefault();
          FlowEditor.print();
          break;
        case "b":
          event.preventDefault();
          FlowEditor.toggleMark(editor, "bold");
          break;
        case "i":
          event.preventDefault();
          FlowEditor.toggleMark(editor, "italic");
          break;
        default:
          break;
      }
    }
  };

  return (
    <Editable
      spellCheck={true}
      autoFocus={true}
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
};

const Textbox = (props) => {
  return (
    <Box
      as={Input}
      sx={{
        flex: "1 1 auto",
        padding: 5,
        "@media print": {
          padding: 0,
          color: Colors.gray[10],
          bg: Colors.gray[0],
        },
      }}
      {...props}
    />
  );
};

const Toolbox = (props) => {
  const { children } = props;

  return (
    <Box
      bg="background"
      px={5}
      py={3}
      sx={{
        flexWrap: "wrap",
        "@supports (position: sticky)": {
          position: "sticky",
        },
        top: 0,
        "@media print": {
          display: "none",
        },
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const ActionButton = (props) => {
  const { icon, label, active, disabled, action } = props;

  return (
    <Button
      title={label}
      aria-label={label}
      onMouseDown={action}
      disabled={disabled}
      variant={active ? "primary" : "secondary"}
      {...props}
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
    </Button>
  );
};

const MarkButton = (props) => {
  const { format } = props;
  const editor = useSlate();

  return (
    <ActionButton
      active={FlowEditor.isMarkActive(editor, format)}
      label="Mark"
      action={(event) => {
        event.preventDefault();
        FlowEditor.toggleMark(editor, format);
      }}
      {...props}
    />
  );
};

const BlockButton = (props) => {
  const { format } = props;
  const editor = useSlate();

  return (
    <ActionButton
      active={FlowEditor.isBlockActive(editor, format)}
      label="Block"
      action={(event) => {
        event.preventDefault();
        FlowEditor.toggleBlock(editor, format);
      }}
      {...props}
    />
  );
};

const AlignButton = (props) => {
  const { format } = props;
  const editor = useSlate();

  return (
    <ActionButton
      active={FlowEditor.isAlignActive(editor, format)}
      label="Align"
      action={(event) => {
        event.preventDefault();
        FlowEditor.toggleAlign(editor, format);
      }}
      {...props}
    />
  );
};

const ColorSwitch = (props) => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <ActionButton
      label={(colorMode === "dark" ? "Light" : "Dark") + " Mode"}
      icon={colorMode === "dark" ? "sun" : "moon"}
      action={(event) => {
        event.preventDefault();
        setColorMode(colorMode === "dark" ? "light" : "dark");
      }}
      {...props}
    />
  );
};

library.add(
  faExpand,
  faCompress,
  faUndo,
  faRedo,
  faPrint,
  faBold,
  faItalic,
  faParagraph,
  faHeading,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faMoon,
  faSun
);

render(<Root />, window.document.getElementById("root"));

// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//serviceWorker.register();
