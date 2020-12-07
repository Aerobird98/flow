/** @jsx h */
import { h, render } from "preact";
import { useMemo, useState, useCallback, useLayoutEffect } from "preact/hooks";
import {
  createEditor,
  Transforms as SlateTransforms,
  Editor as SlateEditor,
  Node as SlateNode,
  Text as SlateText,
  Range as SlateRange,
} from "slate";
import {
  Slate,
  useSlate,
  Editable as SlateEditable,
  withReact,
} from "slate-react";
import {
  withHistory,
  HistoryEditor as SlateHistoryEditor,
} from "slate-history";
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
  faTerminal,
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

const faH1 = {
  prefix: "fas",
  iconName: "h1",
  icon: [
    576,
    512,
    [],
    "f313",
    "M304 96h-98.94A13.06 13.06 0 0 0 192 109.06v37.88A13.06 13.06 0 0 0 205.06 160H224v64H96v-64h18.94A13.06 13.06 0 0 0 128 146.94V112a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v34.94A13.06 13.06 0 0 0 13.06 160H32v192H13.06A13.06 13.06 0 0 0 0 365.06V400a16 16 0 0 0 16 16h98.94A13.06 13.06 0 0 0 128 402.94v-37.88A13.06 13.06 0 0 0 114.94 352H96v-64h128v64h-18.94A13.06 13.06 0 0 0 192 365.06V400a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-34.94A13.06 13.06 0 0 0 306.94 352H288V160h18.94A13.06 13.06 0 0 0 320 146.94V112a16 16 0 0 0-16-16zm256 256h-48V120a24 24 0 0 0-24-24h-40a24 24 0 0 0-21.44 13.26l-24 48A24 24 0 0 0 424 192h24v160h-48a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z",
  ],
};

const faH2 = {
  prefix: "fas",
  iconName: "h2",
  icon: [
    576,
    512,
    [],
    "f314",
    "M560 352H440.79c17-42.95 135.21-66.57 135.21-159.62C576 132.55 528.33 96 469.14 96c-43.83 0-81.41 21.38-103.42 57a15.66 15.66 0 0 0 4.75 21.4l28.26 18.6a16.15 16.15 0 0 0 21.86-3.83c10.77-14.86 24.94-26 43.85-26s38.22 10.46 38.22 33.84c0 52.18-142.1 73.21-142.1 184.56a155.06 155.06 0 0 0 1.71 20.66A15.94 15.94 0 0 0 378.14 416H560a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM304 96h-98.94A13.06 13.06 0 0 0 192 109.06v37.88A13.06 13.06 0 0 0 205.06 160H224v64H96v-64h18.94A13.06 13.06 0 0 0 128 146.94V112a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v34.94A13.06 13.06 0 0 0 13.06 160H32v192H13.06A13.06 13.06 0 0 0 0 365.06V400a16 16 0 0 0 16 16h98.94A13.06 13.06 0 0 0 128 402.94v-37.88A13.06 13.06 0 0 0 114.94 352H96v-64h128v64h-18.94A13.06 13.06 0 0 0 192 365.06V400a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-34.94A13.06 13.06 0 0 0 306.94 352H288V160h18.94A13.06 13.06 0 0 0 320 146.94V112a16 16 0 0 0-16-16z",
  ],
};

const faH3 = {
  prefix: "fas",
  iconName: "h3",
  icon: [
    576,
    512,
    [],
    "f315",
    "M499 217.69l64.4-72.31a15.48 15.48 0 0 0 4-10.31v-23.32A16 16 0 0 0 551.12 96H384a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h85.18c-2.29 2.45-4.65 5-7.19 7.9l-53.1 61.1a18 18 0 0 0-3.83 10.17 18.36 18.36 0 0 0 1.38 6.34l8.41 18.59c2.35 5.21 9 9.42 14.84 9.42h15.95c28.94 0 57.79 10.32 57.79 38.48 0 21.32-19.93 36.79-47.39 36.79-22.08 0-41.18-9.17-57.7-22.83a16.46 16.46 0 0 0-23.87 3.34l-19.75 28.8a15.46 15.46 0 0 0 2.53 20.35C384.9 403.21 422 416 459.51 416c71 0 116.49-48.86 116.49-106.06 0-47.3-32.73-80.89-77-92.25zM304 96h-98.94A13.06 13.06 0 0 0 192 109.06v37.88A13.06 13.06 0 0 0 205.06 160H224v64H96v-64h18.94A13.06 13.06 0 0 0 128 146.94V112a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v34.94A13.06 13.06 0 0 0 13.06 160H32v192H13.06A13.06 13.06 0 0 0 0 365.06V400a16 16 0 0 0 16 16h98.94A13.06 13.06 0 0 0 128 402.94v-37.88A13.06 13.06 0 0 0 114.94 352H96v-64h128v64h-18.94A13.06 13.06 0 0 0 192 365.06V400a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-34.94A13.06 13.06 0 0 0 306.94 352H288V160h18.94A13.06 13.06 0 0 0 320 146.94V112a16 16 0 0 0-16-16z",
  ],
};

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
    italic: "sailecLight, sans-serif",
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
    paragraph: 1.5,
    heading: 1.2,
  },
  space: ["0rem", "0.25rem", "0.5rem", "1rem", "1.5rem", "3rem"],
  breakpoints: [576, 768, 992, 1200, 1400],
  text: {
    paragraph: {
      fontFamily: "light",
      lineHeight: "paragraph",
    },
    heading: {
      fontFamily: "regular",
      lineHeight: "heading",
    },
  },
  styles: {
    root: {
      fontFamily: "code",
      lineHeight: "paragraph",
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
      fontFamily: "italic",
    },
    b: {
      fontFamily: "bold",
    },
    em: {
      fontFamily: "italic",
    },
    strong: {
      fontFamily: "bold",
    },
  },
  buttons: {
    primary: {
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
    secondary: {
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
          text: Colors.gray[0],
          background: Colors.gray[10],
          primary: Colors.cyan,
          secondary: Colors.gray[0],
        },
      },
    },
  },
};

const FlowEditor = {
  // Define a serializing function that takes a value and
  // returns the string content of each node in the value's children
  // then joins them all with line breaks denoting paragraphs.
  toPlainText(value) {
    return value.map((n) => SlateNode.string(n)).join("\n");
  },

  // Define a deserializing function that takes a string and
  // returns a value as an array of children derived by splitting the string.
  fromPlainText(text) {
    return text.split("\n").map((paragraph) => {
      return {
        children: [{ text: paragraph }],
      };
    });
  },

  getStatistics(value) {
    const text = FlowEditor.toPlainText(value);

    // Remove all 3 types of line-breaks.
    const noBreaks = text.replace(/(\r\n|\n|\r)/gm, "");
    // Trim trailing white-space (on both sides).
    const noTrailing = noBreaks.trim();
    // Remove all remaining spaces.
    const noSpaces = noTrailing.replace(/\s+/g, "");
    // Remove all standard ASCII and some special puncturation.
    const noPuncturation = text.replace(
      /[.?!,;:\-[\]{}()'"#&@><\*%\/\\^$%_`~|+=—’“”]/g,
      ""
    );

    const onlyWords = noPuncturation
      // Treat all 3 types of line-breaks as spaces,
      .replace(/(\r\n|\n|\r)/gm, " ")
      // collapse multiple adjacent spaces to single spaces,
      .replace(/\s+/g, " ")
      // trim trailing white-space (on both sides),
      .trim();

    // Return a statistics object containing the results.
    return {
      charsAll: noBreaks.length,
      charsNoTrailing: noTrailing.length,
      charsNoSpaces: noSpaces.length,
      wordsAll: onlyWords === "" ? 0 : onlyWords.split(" ").length,
    };
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

  print() {
    return window.print();
  },

  setValue(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  },

  getValue(key) {
    return (
      JSON.parse(window.localStorage.getItem(key)) || [
        { type: "code", align: "left", children: [{ text: "" }] },
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

  const statistics = FlowEditor.getStatistics(value);

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
            <BlockButton format="heading1" icon="h1" label="Heading 1" />
            <BlockButton format="heading2" icon="h2" label="Heading 2" />
            <BlockButton format="heading3" icon="h3" label="Heading 3" />
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
            as={Editable}
            sx={{
              flex: "1 1 auto",
              padding: 5,
              "@media print": {
                padding: 0,
                color: Colors.gray[10],
                bg: Colors.gray[0],
              },
            }}
          />
          <Box
            bg="background"
            py={1}
            px={3}
            sx={{
              flexWrap: "wrap",
              "@supports (position: sticky)": {
                position: "sticky",
              },
              bottom: 0,
              "@media print": {
                display: "none",
              },
            }}
          >
            <Icon name="terminal" title="Statistics" aria-label="Statistics" />{" "}
            Words:{" "}
            <Text as="span" title="All" aria-label="All">
              {statistics.wordsAll} Chars:{" "}
            </Text>
            <Text as="span" title="All" aria-label="All">
              {statistics.charsAll}
            </Text>{" "}
            <Text
              as="span"
              title="Without Trailing Spaces"
              aria-label="Without Trailing Spaces"
            >
              {statistics.charsNoTrailing}
            </Text>{" "}
            <Text as="span" title="Without Spaces" aria-label="No Spaces">
              {statistics.charsNoSpaces}
            </Text>
          </Box>
        </Box>
      </Slate>
    </ThemeProvider>
  );
};

const Leaf = (props) => {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <Text as={Styled.b}>{children}</Text>;
  }

  if (leaf.italic) {
    children = <Text as={Styled.i}>{children}</Text>;
  }

  return (
    <Text as="span" {...attributes}>
      {children}
    </Text>
  );
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

const Heading1Element = (props) => {
  const { attributes, children, element } = props;

  return (
    <Heading
      as={Styled.h1}
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

const Heading2Element = (props) => {
  const { attributes, children, element } = props;

  return (
    <Heading
      as={Styled.h2}
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

const Heading3Element = (props) => {
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
    case "heading1":
      return <Heading1Element {...props} />;
    case "heading2":
      return <Heading2Element {...props} />;
    case "heading3":
      return <Heading3Element {...props} />;
    case "code":
      return <DefaultElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
};

const Editable = (props) => {
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
        case "u":
          event.preventDefault();
          FlowEditor.toggleMark(editor, "underline");
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
          FlowEditor.toggleBlock(editor, "heading1");
          break;
        case "3":
          event.preventDefault();
          FlowEditor.toggleBlock(editor, "heading2");
          break;
        case "4":
          event.preventDefault();
          FlowEditor.toggleBlock(editor, "heading3");
          break;
        default:
          break;
      }
    }
  };

  return (
    <SlateEditable
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
};

const Icon = (props) => {
  const { name } = props;

  return <FontAwesomeIcon icon={name} fixedWidth {...props} />;
};

const ActionButton = (props) => {
  const { icon, label, active, disabled, action } = props;

  const mouseAction = (event) => {
    event.preventDefault();
    action(event);
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
      title={label}
      aria-label={label}
      onMouseDown={mouseAction}
      onKeyDown={keyboardAction}
      disabled={disabled}
      variant={active ? "primary" : "secondary"}
      mb={1}
      mr={1}
      {...props}
    >
      <Icon name={icon} />
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
        SlateHistoryEditor.undo(editor);
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
        SlateHistoryEditor.redo(editor);
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
        FlowEditor.print();
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
  faH1,
  faH2,
  faH3,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faMoon,
  faSun,
  faTerminal
);

render(<Root />, document.getElementById("root"));
