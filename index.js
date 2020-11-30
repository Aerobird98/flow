/** @jsx h */
import { h, render } from "preact";
import { useMemo, useState, useCallback, useLayoutEffect } from "preact/hooks";
import {
  createEditor,
  Transforms,
  Editor,
  Node,
  Text as slateText,
  Range,
} from "slate";
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

import {
  ThemeProvider,
  useColorMode,
  Box,
  Button,
  Styled,
  Text,
  Heading,
} from "theme-ui";

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

const BaseTheme = {
  initialColorMode: "light",
  fonts: {
    light: "sailecLight, sans-serif",
    regular: "sailecRegular, sans-serif",
    bold: "sailecBold, sans-serif",
    code: "firaCode, monospace",
  },
  fontSizes: ["1rem", "1.25rem", "1.5rem", "1.75rem", "2rem", "2.5rem"],
  fontWeights: {
    extraThin: 100,
    thin: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    ultraBold: 900,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.2,
  },
  space: ["0rem", "0.25rem", "0.5rem", "1rem", "1.5rem", "3rem"],
  breakpoints: [576, 768, 992, 1200, 1400],
  text: {
    paragraph: {
      fontFamily: "light",
      lineHeight: "body",
    },
    heading: {
      fontFamily: "regular",
      lineHeight: "heading",
    },
  },
  styles: {
    root: {
      fontFamily: "light",
      lineHeight: "body",
    },
    p: {
      variant: "text.paragraph",
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
      fontFamily: "code",
    },
    i: {
      fontFamily: "light",
    },
    b: {
      fontFamily: "bold",
    },
  },
  buttons: {
    on: {
      color: "primary",
      bg: "background",
      borderRadius: "1rem",
      borderColor: "transparent",
      "&:hover": {
        color: "primary",
      },
      "&:focus": {
        color: "background",
        bg: "primary",
      },
      "&:focus, &:hover": {
        outline: 0,
      },
      "&:disabled": {
        opacity: 0.5,
        color: "primary",
        bg: "background",
      },
    },
    off: {
      color: "secondary",
      bg: "background",
      borderRadius: "1rem",
      borderColor: "transparent",
      "&:hover": {
        color: "secondary",
      },
      "&:focus": {
        color: "background",
        bg: "secondary",
      },
      "&:focus, &:hover": {
        outline: 0,
      },
      "&:disabled": {
        opacity: 0.5,
        color: "secondary",
        bg: "background",
      },
    },
  },
};

const Themes = {
  flow: {
    ...BaseTheme,
    colors: {
      text: Colors.gray[8],
      background: Colors.gray[2],
      primary: Colors.blue,
      secondary: Colors.gray[8],
      modes: {
        dark: {
          text: "#ffede6",
          background: "#050528",
          primary: "#e9dd77",
          secondary: "#ffede6",
        },
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
      universal: true,
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
          match: (n) => slateText.isText(n),
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

  useFullcreen(element) {
    const isfullscreenActive = () => {
      return !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    const [isInFullscreen, setIsInFullscreen] = useState(isfullscreenActive());

    const requestFullscreen = () => {
      if (element.requestFullscreen) {
        return element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        return element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        return element.msRequestFullscreen();
      }
    };

    const exitFullscreen = () => {
      if (document.exitFullscreen) {
        return document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        return document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        return document.msExitFullscreen();
      }
    };

    const toggleFullscreen = () => {
      if (isInFullscreen) {
        exitFullscreen()
          .then(() => {
            setIsInFullscreen(isfullscreenActive());
          })
          .catch(() => {
            setIsInFullscreen(true);
          });
      } else {
        requestFullscreen()
          .then(() => {
            setIsInFullscreen(isfullscreenActive());
          })
          .catch(() => {
            setIsInFullscreen(false);
          });
      }
    };

    useLayoutEffect(() => {
      document.onfullscreenchange = () =>
        setIsInFullscreen(isfullscreenActive());

      return () => (document.onfullscreenchange = undefined);
    });

    return [isInFullscreen, toggleFullscreen];
  },

  modifier(event) {
    return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
      ? event.metaKey
      : event.ctrlKey;
  },

  print() {
    return window.print();
  },

  setValue(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  },

  getValue(key) {
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
  const [value, setValue] = useState(FlowEditor.getValue("value"));

  const onChange = (value) => {
    setValue(value);
    FlowEditor.setValue("value", value);
  };

  return (
    <ThemeProvider theme={Themes.flow}>
      <Slate editor={editor} value={value} onChange={onChange}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            "@media print": {
              display: "block",
            },
          }}
        >
          <Toolbox>
            <FullscreenButton mb={1} mr={1} />
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
              format="heading"
              icon="heading"
              label="Heading"
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
            <ColorSwitch mb={1} mr={1} />
          </Toolbox>
          <Textbox />
        </Box>
      </Slate>
    </ThemeProvider>
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

const DefaultElement = (props) => {
  const { attributes, children, element } = props;

  return (
    <Text
      as={Styled.div}
      sx={{
        textAlign: element.align,
      }}
      {...attributes}
    >
      {children}
    </Text>
  );
};

const ParagraphElement = (props) => {
  const { attributes, children, element } = props;

  return (
    <Text
      as={Styled.p}
      mb={4}
      sx={{
        textAlign: element.align,
      }}
      {...attributes}
    >
      {children}
    </Text>
  );
};

const HeadingElement = (props) => {
  const { attributes, children, element } = props;

  return (
    <Heading
      as={Styled.h3}
      mb={3}
      sx={{
        textAlign: element.align,
      }}
      {...attributes}
    >
      {children}
    </Heading>
  );
};

const Element = (props) => {
  const { element } = props;

  switch (element.type) {
    case "paragraph":
      return <ParagraphElement {...props} />;
    case "heading":
      return <HeadingElement {...props} />;
    default:
      return <DefaultElement {...props} />;
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
    if (FlowEditor.modifier(event)) {
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
      py={3}
      ml={1}
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
      variant={active ? "on" : "off"}
      {...props}
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
    </Button>
  );
};

const FullscreenButton = (props) => {
  const [isInFullscreen, toggleFullscreen] = FlowEditor.useFullcreen(
    document.documentElement
  );

  return (
    <ActionButton
      icon={isInFullscreen ? "compress" : "expand"}
      label={isInFullscreen ? "Compress" : "Expand"}
      action={(event) => {
        event.preventDefault();
        toggleFullscreen();
      }}
      {...props}
    />
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

render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//serviceWorker.register();
