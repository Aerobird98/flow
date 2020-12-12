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

const colors = {
  black: "#1b1f23",
  white: "#fff",
  gray: [
    "#fafbfc",
    "#f6f8fa",
    "#e1e4e8",
    "#d1d5da",
    "#959da5",
    "#6a737d",
    "#586069",
    "#444d56",
    "#2f363d",
    "#24292e",
  ],
  blue: [
    "#f1f8ff",
    "#dbedff",
    "#c8e1ff",
    "#79b8ff",
    "#2188ff",
    "#0366d6",
    "#005cc5",
    "#044289",
    "#032f62",
    "#05264c",
  ],
  green: [
    "#f0fff4",
    "#dcffe4",
    "#bef5cb",
    "#85e89d",
    "#34d058",
    "#28a745",
    "#22863a",
    "#176f2c",
    "#165c26",
    "#144620",
  ],
  yellow: [
    "#fffdef",
    "#fffbdd",
    "#fff5b1",
    "#ffea7f",
    "#ffdf5d",
    "#ffd33d",
    "#f9c513",
    "#dbab09",
    "#b08800",
    "#735c0f",
  ],
  orange: [
    "#fff8f2",
    "#ffebda",
    "#ffd1ac",
    "#ffab70",
    "#fb8532",
    "#f66a0a",
    "#e36209",
    "#d15704",
    "#c24e00",
    "#a04100",
  ],
  red: [
    "#ffeef0",
    "#ffdce0",
    "#fdaeb7",
    "#f97583",
    "#ea4a5a",
    "#d73a49",
    "#cb2431",
    "#b31d28",
    "#9e1c23",
    "#86181d",
  ],
  purple: [
    "#f5f0ff",
    "#e6dcfd",
    "#d1bcf9",
    "#b392f0",
    "#8a63d2",
    "#6f42c1",
    "#5a32a3",
    "#4c2889",
    "#3a1d6e",
    "#29134e",
  ],
  pink: [
    "#ffeef8",
    "#fedbf0",
    "#f9b3dd",
    "#f692ce",
    "#ec6cb9",
    "#ea4aaa",
    "#d03592",
    "#b93a86",
    "#99306f",
    "#6d224f",
  ],
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
    up: {
      color: "text",
      bg: "transparent",
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
      opacity: 0.4,
      "&:focus, &:hover": {
        outline: 0,
        opacity: 1,
      },
      "&:disabled": {
        opacity: 0.1,
      },
    },
  },
};

const themes = {
  flow: {
    ...BaseTheme,
    colors: {
      text: "#0d1117",
      background: "#c8e1ff",
      modes: {
        dark: {
          text: "#c8e1ff",
          background: "#0d1117",
        },
      },
    },
  },
};

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
    <ThemeProvider theme={themes.flow}>
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
            as={Editable}
            sx={{
              flex: "1 1 auto",
              padding: 5,
              "@media print": {
                padding: 0,
                color: colors.gray[10],
                bg: colors.gray[0],
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
            <Text as="span" title="Word Count" aria-label="Word Count">
              Words:
            </Text>{" "}
            <Text as="span" title="All" aria-label="All">
              {statistics.wordsAll}
            </Text>{" "}
            <Text
              as="span"
              title="Character Count"
              aria-label="Character Count"
            >
              Chars:
            </Text>{" "}
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
          FlowEditor.toggleBlock(editor, "heading");
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
      variant={active ? "up" : "down"}
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
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faMoon,
  faSun
);

render(<Root />, document.getElementById("root"));
