import React, { useMemo, useState, useCallback } from "react";
import { render } from "react-dom";
import { createEditor, Transforms, Editor } from "slate";
import { Slate, useSlate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faServer,
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
  faAlignJustify
} from "@fortawesome/free-solid-svg-icons";

import "./app.scss";

// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//import * as serviceWorker from "./serviceWorker.js";

const FlowEditor = {
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === format
    });

    return !!match;
  },

  isAlignActive(editor, align) {
    const [match] = Editor.nodes(editor, {
      match: n => n.align === align
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
        type: active ? null : format
      },
      {
        match: n => Editor.isBlock(editor, n)
      }
    );
  },

  toggleAlign(editor, format) {
    const active = FlowEditor.isAlignActive(editor, format);
    Transforms.setNodes(
      editor,
      {
        align: active ? null : format
      },
      {
        match: n => Editor.isBlock(editor, n)
      }
    );
  }
};

const Flow = props => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem("content")) || [
      { children: [{ text: "" }] }
    ]
  );
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value);
        localStorage.setItem("content", JSON.stringify(value));
      }}
      {...props}
    >
      <FlowTools className="d-print-none sticky-top bg-light" />
      <FlowEditable
        className="d-print-block d-print-p-0 p-5"
        spellCheck
        autoFocus
      />
    </Slate>
  );
};

const Leaf = props => {
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

const Element = props => {
  const { attributes, element } = props;
  let { children } = props;
  switch (element.type) {
    case "heading-one":
      return (
        <h1 className={element.align} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 className={element.align} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 className={element.align} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 className={element.align} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 className={element.align} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 className={element.align} {...attributes}>
          {children}
        </h6>
      );
    case "paragraph":
      return (
        <p className={element.align} {...attributes}>
          {children}
        </p>
      );
    default:
      return (
        <div className={element.align} {...attributes}>
          {children}
        </div>
      );
  }
};

const FlowEditable = props => {
  const editor = useSlate();

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback(props => {
    return <Element {...props} />;
  }, []);

  return (
    <Editable
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      onKeyDown={event => {
        if (event.ctrlKey) {
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
      }}
      {...props}
    />
  );
};

const FlowTools = props => {
  const editor = useSlate();
  return (
    <div {...props}>
      <FlowButton
        disabled
        icon="server"
        onMouseDown={event => {
          event.preventDefault();
        }}
      />
      <FlowButton
        disabled={editor.history.undos.length === 0}
        icon="undo"
        onMouseDown={event => {
          event.preventDefault();
          editor.undo();
        }}
      />
      <FlowButton
        disabled={editor.history.redos.length === 0}
        icon="redo"
        onMouseDown={event => {
          event.preventDefault();
          editor.redo();
        }}
      />
      <MarkButton format="bold" icon="bold" />
      <MarkButton format="italic" icon="italic" />
      <MarkButton format="underline" icon="underline" />
      <MarkButton format="strikethrough" icon="strikethrough" />
      <MarkButton format="code" icon="code" />
      <MarkButton format="subscript" icon="subscript" />
      <MarkButton format="superscript" icon="superscript" />
      <BlockButton format="paragraph" icon="paragraph" />
      <BlockButton format="heading-one" icon="heading" />
      <BlockButton format="heading-two" icon="heading" />
      <BlockButton format="heading-three" icon="heading" />
      <AlignButton format="text-left" icon="align-left" />
      <AlignButton format="text-center" icon="align-center" />
      <AlignButton format="text-right" icon="align-right" />
      <AlignButton format="text-justify" icon="align-justify" />
    </div>
  );
};

const FlowIcon = props => {
  const { icon } = props;
  return <FontAwesomeIcon icon={icon} fixedWidth />;
};

const FlowButton = props => {
  const { icon, label, active, disabled, onMouseDown } = props;
  return (
    <button
      title={label || icon.iconName}
      aria-label={label || icon.iconName}
      onMouseDown={onMouseDown}
      className={
        "btn btn-outline-success rounded-0 border-0 " +
        (active ? "active" : "") +
        (disabled ? " disabled" : "")
      }
    >
      <FlowIcon icon={icon} />
      {label}
    </button>
  );
};

const BlockButton = props => {
  const { format } = props;
  const editor = useSlate();
  return (
    <FlowButton
      active={FlowEditor.isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        FlowEditor.toggleBlock(editor, format);
      }}
      {...props}
    />
  );
};

const MarkButton = props => {
  const { format } = props;
  const editor = useSlate();
  return (
    <FlowButton
      active={FlowEditor.isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        FlowEditor.toggleMark(editor, format);
      }}
      {...props}
    />
  );
};

const AlignButton = props => {
  const { format } = props;
  const editor = useSlate();
  return (
    <FlowButton
      active={FlowEditor.isAlignActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        FlowEditor.toggleAlign(editor, format);
      }}
      {...props}
    />
  );
};

library.add(
  faServer,
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
  faAlignJustify
);
render(<Flow />, document.getElementById("app"));
// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//serviceWorker.register();
