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
  faGlasses,
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
      fontFamily: "code",
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

    const isEmpty = (text) => {
      return text === "";
    };

    const onlyWords = text
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/\s+/g, " ")
      .trim();
    const noBreaks = text.replace(/(\r\n|\n|\r)/gm, "");
    const noTrailing = noBreaks.trim();
    const noSpaces = noTrailing.replace(/\s+/g, "");

    return {
      words: isEmpty(onlyWords) ? 0 : onlyWords.split(" ").length,
      charsAll: isEmpty(text) ? 0 : noBreaks.length,
      charsNoTrailing: isEmpty(text) ? 0 : noTrailing.length,
      charsNoSpaces: isEmpty(text) ? 0 : noSpaces.length,
    };
  },

  isMarkActive(editor, format) {
    const [match] = SlateEditor.nodes(editor, {
      match: (n) => n[format] === true,
      universal: true,
    });

    return !!match;
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

  isSelectionActive(editor) {
    const { selection } = editor;
    return selection && !SlateRange.isCollapsed(selection);
  },

  toggleMark(editor, format) {
    const active = FlowEditor.isMarkActive(editor, format);
    const selection = FlowEditor.isSelectionActive(editor);

    if (selection) {
      SlateTransforms.setNodes(
        editor,
        {
          [format]: active ? null : true,
        },
        {
          match: (n) => SlateText.isText(n),
          split: true,
        }
      );
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
            <Icon name="glasses" title="Statistics" aria-label="Statistics" />{" "}
            Words:{" "}
            <Text as="span" title="All" aria-label="All">
              {statistics.words} Chars:{" "}
            </Text>
            <Text as="span" title="All" aria-label="All">
              {statistics.charsAll}
            </Text>{" "}
            <Text
              as="span"
              title="No Trailing Spaces"
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
    <SlateEditable
      spellCheck={false}
      autoFocus={true}
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

const IconButton = (props) => {
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
      variant={active ? "on" : "off"}
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
    <IconButton
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
    <IconButton
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
    <IconButton
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
    <IconButton
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
    <IconButton
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
    <IconButton
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
    <IconButton
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
    <IconButton
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
  faSun,
  faGlasses
);

render(<Root />, document.getElementById("root"));
