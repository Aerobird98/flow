/** @jsx h */
import { h, render } from "preact";
import { useMemo, useState, useCallback, useLayoutEffect } from "preact/hooks";
import {
  createEditor as createSlateEditor,
  Transforms as SlateTransforms,
  Editor as SlateEditor,
  Node as SlateNode,
  //Text as SlateText,
  //Range as SlateRange,
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
  faCode,
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
  Themed,
  Text,
  Heading,
} from "theme-ui";

const FlowEditor = {
  // Take a value and return the string content of each node
  // in the value's children then join them all with line breaks denoting paragraphs.
  toPlainText(value) {
    return value.map((n) => SlateNode.string(n)).join("\n");
  },

  // Take a string and return a value as an array of children derived by splitting the string.
  fromPlainText(text) {
    return text.split("\n").map((paragraph) => {
      return {
        children: [{ text: paragraph }],
      };
    });
  },

  fromJSON(value) {
    return JSON.stringify(value);
  },

  toJSON(text) {
    return (
      JSON.parse(text) || [
        { type: "code", align: "left", children: [{ text: "" }] },
      ]
    );
  },

  getStatistics(value) {
    const text = FlowEditor.toPlainText(value);

    // Remove all 3 types of line-breaks.
    const noBreaks = text.replace(/(\r\n|\n|\r)/gm, "");
    // Trim trailing white-space (on both sides).
    const noTrailing = noBreaks.trim();
    // Remove all remaining spaces.
    const noSpaces = noTrailing.replace(/\s+/g, "");
    // Remove all standard ASCII, some special puncturation and digits.
    const noPuncturation = text.replace(
      /([.?!,;:\-[\]{}()'"#&@><\*%\/\\^$%_`~|+=—’“”]|\d+)/g,
      ""
    );

    const words = noPuncturation
      // Trim trailing white-space (on both sides),
      .trim()
      // treat all 3 types of line-breaks as spaces,
      .replace(/(\r\n|\n|\r)/gm, " ")
      // collapse multiple adjacent spaces to single spaces.
      .replace(/\s+/g, " ");

    const statistics = {
      charsAll: noBreaks.length,
      charsNoTrailing: noTrailing.length,
      charsNoSpaces: noSpaces.length,
      wordsAll: words === "" ? 0 : words.split(" ").length,
    };

    return statistics;
  },

  isMarkActive(editor, format) {
    const marks = SlateEditor.marks(editor);

    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor, format) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => n.type === format,
    });

    return !!match;
  },

  isAlignActive(editor, format) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => n.align === format,
    });

    return !!match;
  },

  toggleMark(editor, format) {
    const active = FlowEditor.isMarkActive(editor, format);

    if (active) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
  },

  toggleBlock(editor, format) {
    const active = FlowEditor.isBlockActive(editor, format);

    SlateTransforms.setNodes(
      editor,
      {
        type: active ? "code" : format,
      },
      {
        match: (n) => SlateEditor.isBlock(editor, n),
      }
    );
  },

  toggleAlign(editor, format) {
    const active = FlowEditor.isAlignActive(editor, format);

    SlateTransforms.setNodes(
      editor,
      {
        align: active ? "left" : format,
      },
      {
        match: (n) => SlateEditor.isBlock(editor, n),
      }
    );
  },

  useFullcreen(element) {
    const isfullscreenActive = () => {
      return !!(
        window.document.fullscreenElement ||
        window.document.mozFullScreenElement ||
        window.document.webkitFullscreenElement ||
        window.document.msFullscreenElement
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
      if (window.document.exitFullscreen) {
        return window.document.exitFullscreen();
      } else if (window.document.mozCancelFullScreen) {
        return window.document.mozCancelFullScreen();
      } else if (window.document.webkitExitFullscreen) {
        return window.document.webkitExitFullscreen();
      } else if (window.document.msExitFullscreen) {
        return window.document.msExitFullscreen();
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
      window.document.onfullscreenchange = () =>
        setIsInFullscreen(isfullscreenActive());

      return () => (window.document.onfullscreenchange = undefined);
    });

    return [isInFullscreen, toggleFullscreen];
  },
};

const withFlow = (editor) => {
  return editor;
};

const Root = () => {
  const theme = {
    initialColorMode: "light",
    colors: {
      text: "#040f1b",
      background: "#ffffff",
      primary: "#3bb5ff",
      modes: {
        dark: {
          text: "#abbcdc",
          background: "#040f1b",
        },
      },
    },
    fonts: {
      heading: "Garet, sans-serif",
      paragraph: "Garet, sans-serif",
      code: "FiraCode, monospace",
    },
    fontSizes: ["1rem", "1.335rem", "1.5rem", "1.75rem", "2rem", "2.5rem"],
    fontWeights: {
      thin: 50,
      light: 100,
      book: 200,
      medium: 300,
      regular: 400,
      bold: 500,
      extraBold: 600,
      heavy: 700,
      black: 800,
      fat: 900,
    },
    lineHeights: ["1rem", "1.335rem", "1.5rem", "1.75rem", "2rem", "2.5rem"],
    space: ["0rem", "0.335rem", "0.5rem", "1rem", "1.5rem", "3rem"],
    breakpoints: ["576px", "768px", "992px", "1200px", "1400px"],
    text: {
      paragraph: {
        fontFamily: "paragraph",
        fontWeight: "book",
        fontStyle: "normal",
        fontKerning: "normal",
        lineHeight: 2,
        fontSize: 0,
      },
      heading: {
        fontFamily: "heading",
        fontWeight: "book",
        fontStyle: "normal",
        fontKerning: "normal",
        lineHeight: 4,
        fontSize: 1,
      },
      code: {
        fontFamily: "code",
        fontWeight: "regular",
        fontStyle: "normal",
        fontKerning: "normal",
        lineHeight: 2,
        fontSize: 0,
      },
    },
    styles: {
      root: {
        variant: "text.code",
      },
      p: {
        variant: "text.paragraph",
      },
      h5: {
        variant: "text.heading",
      },
      div: {
        variant: "text.code",
      },
      b: {
        fontWeight: "bold",
      },
      strong: {
        fontWeight: "bold",
      },
      i: {
        fontWeight: "light",
        fontStyle: "italic",
      },
      em: {
        fontWeight: "light",
        fontStyle: "italic",
      },
    },
    buttons: {
      up: {
        color: "primary",
        bg: "transparent",
        opacity: 1,
        "&:focus, &:hover": {
          outline: 0,
        },
        "&:disabled": {
          opacity: 0.1,
        },
      },
      down: {
        color: "text",
        bg: "transparent",
        opacity: 1,
        "&:focus, &:hover": {
          outline: 0,
          color: "primary",
        },
        "&:disabled": {
          opacity: 0.1,
        },
      },
    },
  };

  const editor = useMemo(
    () => withFlow(withHistory(withReact(createSlateEditor()))),
    []
  );

  const [value, setValue] = useState(
    FlowEditor.toJSON(window.localStorage.getItem("value"))
  );

  const onChange = (value) => {
    setValue(value);
    window.localStorage.setItem("value", FlowEditor.fromJSON(value));
  };

  const statistics = FlowEditor.getStatistics(value);

  return (
    <ThemeProvider theme={theme}>
      <Slate editor={editor} value={value} onChange={onChange}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "static",
            minHeight: "100vh",
            "@media print": {
              display: "block",
            },
          }}
        >
          <Box
            py={3}
            sx={{
              bg: "background",
              flexWrap: "wrap",
              position: "static",
              "@supports (position: sticky)": {
                position: "sticky",
              },
              top: 0,
              "@media print": {
                display: "none",
              },
            }}
          >
            <FullscreenButton />
            <UndoButton />
            <RedoButton />
            <PrintButton />
            <MarkButton format="bold" icon="bold" label="Bold" />
            <MarkButton format="italic" icon="italic" label="Italic" />
            <BlockButton format="code" icon="code" label="Code" />
            <BlockButton
              format="paragraph"
              icon="paragraph"
              label="Paragraph"
            />
            <BlockButton format="heading" icon="heading" label="Heading" />
            <AlignButton format="left" icon="align-left" label="Left" />
            <AlignButton format="center" icon="align-center" label="Center" />
            <AlignButton format="right" icon="align-right" label="Right" />
            <AlignButton
              format="justify"
              icon="align-justify"
              label="Justify"
            />
            <ColorSwitch />
          </Box>
          <Box
            as={Textfield}
            sx={{
              flex: "1 1 auto",
              position: "static",
              padding: 5,
              "@media print": {
                padding: 0,
                color: "#000000",
                bg: "#ffffff",
              },
            }}
          />
          <Box
            py={1}
            px={3}
            sx={{
              bg: "background",
              flexWrap: "wrap",
              position: "static",
              "@supports (position: sticky)": {
                position: "sticky",
              },
              bottom: 0,
              "@media print": {
                display: "none",
              },
            }}
          >
            <Text as="span" title="Word Count" aria-label="Word Count">
              Words:
            </Text>{" "}
            {statistics.wordsAll} all{" "}
            <Text
              as="span"
              title="Character Count"
              aria-label="Character Count"
            >
              Characters:
            </Text>{" "}
            {statistics.charsNoTrailing} all, {statistics.charsNoSpaces}{" "}
            spaceless
            <Text
              as="span"
              title="Version"
              aria-label="Version"
              sx={{
                float: "right",
              }}
            >
              {" "}
              v.0.18.1
            </Text>
          </Box>
        </Box>
      </Slate>
    </ThemeProvider>
  );
};

const Leaf = (props) => {
  if (props.leaf.bold) {
    props.children = <Text as={Themed.b}>{props.children}</Text>;
  }

  if (props.leaf.italic) {
    props.children = <Text as={Themed.i}>{props.children}</Text>;
  }

  return (
    <Text as="span" {...props.attributes}>
      {props.children}
    </Text>
  );
};

const DefaultElement = (props) => {
  return (
    <Text
      as={Themed.div}
      sx={{
        textAlign: props.element.align,
      }}
      {...props.attributes}
    >
      {props.children}
    </Text>
  );
};

const ParagraphElement = (props) => {
  return (
    <Text
      as={Themed.p}
      mb={3}
      sx={{
        textAlign: props.element.align,
      }}
      {...props.attributes}
    >
      {props.children}
    </Text>
  );
};

const HeadingElement = (props) => {
  return (
    <Heading
      as={Themed.h5}
      mb={3}
      sx={{
        textAlign: props.element.align,
      }}
      {...props.attributes}
    >
      {props.children}
    </Heading>
  );
};

const Element = (props) => {
  switch (props.element.type) {
    case "paragraph":
      return <ParagraphElement {...props} />;
    case "heading":
      return <HeadingElement {...props} />;
    case "code":
      return <DefaultElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
};

const Textfield = (props) => {
  const editor = useSlate();

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props) => {
    return <Element {...props} />;
  }, []);

  const onKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
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
    } else if (event.altKey) {
      switch (event.key) {
        case "0":
          event.preventDefault();
          FlowEditor.toggleBlock(editor, "code");
          break;
        case "1":
          event.preventDefault();
          FlowEditor.toggleBlock(editor, "paragraph");
          break;
        case "2":
          event.preventDefault();
          FlowEditor.toggleBlock(editor, "heading");
          break;
        default:
          break;
      }
    }
  };

  return (
    <Editable
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      onKeyDown={onKeyDown}
      style={{
        position: "static",
      }}
      {...props}
    />
  );
};

const Icon = (props) => {
  return <FontAwesomeIcon icon={props.name} fixedWidth {...props} />;
};

const ActionButton = (props) => {
  const mouseAction = (event) => {
    event.preventDefault();
    props.action(event);
  };

  const keyboardAction = (event) => {
    switch (event.key) {
      case "Enter":
      case " ":
        mouseAction(event);
        break;
      default:
        break;
    }
  };

  return (
    <Button
      title={props.label}
      aria-label={props.label}
      onMouseDown={mouseAction}
      onKeyDown={keyboardAction}
      disabled={props.disabled}
      variant={props.active ? "up" : "down"}
      py={2}
      px={3}
      {...props}
    >
      <Icon name={props.icon} />
    </Button>
  );
};

const FullscreenButton = (props) => {
  const [isInFullscreen, toggleFullscreen] = FlowEditor.useFullcreen(
    window.document.documentElement
  );

  return (
    <ActionButton
      icon={isInFullscreen ? "compress" : "expand"}
      label={isInFullscreen ? "Compress" : "Expand"}
      action={(event) => {
        toggleFullscreen();
      }}
      {...props}
    />
  );
};

const UndoButton = (props) => {
  const editor = useSlate();

  return (
    <ActionButton
      disabled={editor.history.undos.length === 0}
      icon="undo"
      label="Undo"
      action={(event) => {
        HistoryEditor.undo(editor);
      }}
      {...props}
    />
  );
};

const RedoButton = (props) => {
  const editor = useSlate();

  return (
    <ActionButton
      disabled={editor.history.redos.length === 0}
      icon="redo"
      label="Redo"
      action={(event) => {
        HistoryEditor.redo(editor);
      }}
      {...props}
    />
  );
};

const PrintButton = (props) => {
  return (
    <ActionButton
      icon="print"
      label="Print"
      action={(event) => {
        window.print();
      }}
      {...props}
    />
  );
};

const MarkButton = (props) => {
  const editor = useSlate();

  return (
    <ActionButton
      active={FlowEditor.isMarkActive(editor, props.format)}
      label="Mark"
      action={(event) => {
        FlowEditor.toggleMark(editor, props.format);
      }}
      {...props}
    />
  );
};

const BlockButton = (props) => {
  const editor = useSlate();

  return (
    <ActionButton
      active={FlowEditor.isBlockActive(editor, props.format)}
      label="Block"
      action={(event) => {
        FlowEditor.toggleBlock(editor, props.format);
      }}
      {...props}
    />
  );
};

const AlignButton = (props) => {
  const editor = useSlate();

  return (
    <ActionButton
      active={FlowEditor.isAlignActive(editor, props.format)}
      label="Align"
      action={(event) => {
        FlowEditor.toggleAlign(editor, props.format);
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
  faCode,
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
