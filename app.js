/** @jsx h */
import { h, render } from "preact";
import { useMemo, useState, useCallback } from "preact/hooks";
import { createEditor, Transforms, Editor, Node } from "slate";
import { Slate, useSlate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTools,
  faUndo,
  faRedo,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faCode,
  faSubscript,
  faSuperscript,
  faParagraph,
  faHeading,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

import "./app.scss";

// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//import * as serviceWorker from "./serviceWorker.js";

const IS_MAC =
  typeof window != "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

const FlowEditor = {
  // Define a serializing function that takes nodes and
  // returns the string content of each paragraph in the nodes's children
  // then joins them all with line breaks denoting paragraphs.
  serializePlainText(nodes) {
    return nodes.map((n) => Node.string(n)).join("\n");
  },

  // Define a deserializing function that takes a string and
  // returns nodes as an array of children derived by splitting the string.
  deserializePlainText(string) {
    return string.split("\n").map((line) => {
      return {
        children: [{ text: line }],
      };
    });
  },

  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === format,
    });

    return !!match;
  },

  isAlignActive(editor, align) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.align === align,
    });

    return !!match;
  },

  toggleMark(editor, format) {
    const active = FlowEditor.isMarkActive(editor, format);
    if (active) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
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
};

const Flow = (props) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem("content")) || [
      { children: [{ text: "" }] },
    ]
  );

  const onChange = (value) => {
    setValue(value);
    localStorage.setItem("content", JSON.stringify(value));
  };

  return (
    <Slate editor={editor} value={value} onChange={onChange} {...props}>
      <FlowTools class="d-block d-print-none sticky-top bg-light text-dark" />
      <FlowEditable class="d-block d-print-block d-print-p-0 p-5 bg-light text-dark" />
    </Slate>
  );
};

const FlowLeaf = (props) => {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <b>{children}</b>;
  }

  if (leaf.italic) {
    children = <i>{children}</i>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }

  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }

  return <span {...attributes}>{children}</span>;
};

const FlowElement = (props) => {
  const { attributes, element } = props;
  let { children } = props;

  switch (element.type) {
    case "paragraph":
      return (
        <p class={element.align} {...attributes}>
          {children}
        </p>
      );
    case "heading-one":
      return (
        <h1 class={element.align} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 class={element.align} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 class={element.align} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 class={element.align} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 class={element.align} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 class={element.align} {...attributes}>
          {children}
        </h6>
      );
    case "blockquote":
      return (
        <blockquote
          class={element.align + " text-muted border-left pl-3"}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    default:
      return (
        <div class={element.align} {...attributes}>
          {children}
        </div>
      );
  }
};

const FlowEditable = (props) => {
  const editor = useSlate();

  const renderLeaf = useCallback((props) => {
    return <FlowLeaf {...props} />;
  }, []);

  const renderElement = useCallback((props) => {
    return <FlowElement {...props} />;
  }, []);

  const onKeyDown = (event) => {
    if (IS_MAC ? event.metaKey : event.ctrlKey) {
      if (event.altKey) {
        switch (event.key) {
          case "0": {
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "paragraph");
            break;
          }
          case "1": {
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-one");
            break;
          }
          case "2": {
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-two");
            break;
          }
          case "3": {
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-three");
            break;
          }
          case "4": {
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-four");
            break;
          }
          case "5": {
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-five");
            break;
          }
          case "6": {
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-six");
            break;
          }
        }
      }
      switch (event.key) {
        case "b": {
          event.preventDefault();
          FlowEditor.toggleMark(editor, "bold");
          break;
        }
        case "i": {
          event.preventDefault();
          FlowEditor.toggleMark(editor, "italic");
          break;
        }
        case "u": {
          event.preventDefault();
          FlowEditor.toggleMark(editor, "underline");
          break;
        }
        case "s": {
          event.preventDefault();
          FlowEditor.toggleMark(editor, "strikethrough");
          break;
        }
        case "~": {
          event.preventDefault();
          FlowEditor.toggleMark(editor, "code");
          break;
        }
        default:
          break;
      }
    }
  };

  return (
    <Editable
      spellCheck
      autoFocus
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
};

const FlowTools = (props) => {
  const editor = useSlate();

  return (
    <div {...props}>
      <FlowButton disabled icon="tools" label="Tools" />
      <FlowButton
        disabled={editor.history.undos.length === 0}
        icon="undo"
        label="Undo"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.undo();
        }}
      />
      <FlowButton
        disabled={editor.history.redos.length === 0}
        icon="redo"
        label="Redo"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.redo();
        }}
      />
      <MarkButton format="bold" icon="bold" label="Bold" />
      <MarkButton format="italic" icon="italic" label="Italic" />
      <MarkButton format="underline" icon="underline" label="Underline" />
      <MarkButton
        format="strikethrough"
        icon="strikethrough"
        label="Strikethrough"
      />
      <MarkButton format="code" icon="code" label="Code" />
      <MarkButton format="subscript" icon="subscript" label="Subscript" />
      <MarkButton format="superscript" icon="superscript" label="Superscript" />
      <BlockButton format="paragraph" icon="paragraph" label="Paragraph" />
      <BlockButton format="heading-one" icon="heading" label="Heading 1" />
      <BlockButton format="heading-two" icon="heading" label="Heading 2" />
      <BlockButton format="heading-three" icon="heading" label="Heading 3" />
      <BlockButton format="heading-four" icon="heading" label="Heading 4" />
      <BlockButton format="heading-five" icon="heading" label="Heading 5" />
      <BlockButton format="heading-six" icon="heading" label="Heading 6" />
      <BlockButton format="blockquote" icon="quote-left" label="Blockquote" />
      <AlignButton format="text-left" icon="align-left" label="Align Left" />
      <AlignButton
        format="text-center"
        icon="align-center"
        label="Align Center"
      />
      <AlignButton format="text-right" icon="align-right" label="Align Right" />
      <AlignButton
        format="text-justify"
        icon="align-justify"
        label="Align Justify"
      />
    </div>
  );
};

const FlowButton = (props) => {
  const { icon, label, active, disabled, onMouseDown } = props;

  return (
    <button
      title={label}
      aria-label={label}
      onMouseDown={onMouseDown}
      disabled={disabled}
      class={
        "btn btn-outline-dark rounded-0 border-0" +
        (active ? " active" : "") +
        (disabled ? " disabled" : "")
      }
    >
      {icon ? <FontAwesomeIcon icon={icon} fixedWidth /> : label}
    </button>
  );
};

const BlockButton = (props) => {
  const { format } = props;
  const editor = useSlate();

  return (
    <FlowButton
      active={FlowEditor.isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        FlowEditor.toggleBlock(editor, format);
      }}
      {...props}
    />
  );
};

const MarkButton = (props) => {
  const { format } = props;
  const editor = useSlate();

  return (
    <FlowButton
      active={FlowEditor.isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        FlowEditor.toggleMark(editor, format);
      }}
      {...props}
    />
  );
};

const AlignButton = (props) => {
  const { format } = props;
  const editor = useSlate();

  return (
    <FlowButton
      active={FlowEditor.isAlignActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        FlowEditor.toggleAlign(editor, format);
      }}
      {...props}
    />
  );
};

library.add(
  faTools,
  faUndo,
  faRedo,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faCode,
  faSubscript,
  faSuperscript,
  faParagraph,
  faHeading,
  faQuoteLeft,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify
);
render(<Flow />, document.getElementById("app"));
// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//serviceWorker.register();
