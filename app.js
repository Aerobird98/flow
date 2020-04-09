/** @jsx h */
import { h, render } from "preact";
import { useMemo, useState, useCallback } from "preact/hooks";
import { createEditor, Transforms, Editor, Node } from "slate";
import { Slate, useSlate, Editable, withReact } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUndo,
  faRedo,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faParagraph,
  faHeading,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
} from "@fortawesome/free-solid-svg-icons";

import "typeface-quicksand";
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
  const defaultValue = [{ children: [{ text: "" }] }];
  const [value, setValue] = useState(
    JSON.parse(window.localStorage.getItem("content")) || defaultValue
  );

  const onChange = (value) => {
    setValue(value);
    window.localStorage.setItem("content", JSON.stringify(value));
  };

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <div class="d-flex flex-column min-vh-100" {...props}>
        <Toolbox />
        <Textbox />
      </div>
    </Slate>
  );
};

const Leaf = (props) => {
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

  return <span {...attributes}>{children}</span>;
};

const Element = (props) => {
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
        <h1 class={element.align + " h1"} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 class={element.align + " h2"} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 class={element.align + " h3"} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 class={element.align + " h4"} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 class={element.align + " h5"} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 class={element.align + " h6"} {...attributes}>
          {children}
        </h6>
      );
    default:
      return (
        <div class={element.align + " text-monospace"} {...attributes}>
          {children}
        </div>
      );
  }
};

const Textbox = (props) => {
  const editor = useSlate();

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props) => {
    return <Element {...props} />;
  }, []);

  const onKeyDown = (event) => {
    const modifier = IS_MAC ? event.metaKey : event.ctrlKey;

    if (modifier) {
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
      } else {
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
          default:
            break;
        }
      }
    }
  };

  return (
    <Editable
      as="div"
      spellCheck
      autoFocus
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      onKeyDown={onKeyDown}
      class="d-flex flex-column flex-fill d-print-block d-print-p-0 p-5 bg-light text-dark"
      {...props}
    />
  );
};

const Toolbox = (props) => {
  return (
    <div
      class="d-flex flex-wrap p-3 d-print-none sticky-top bg-light text-dark"
      {...props}
    >
      <UndoButton />
      <RedoButton />
      <MarkButton format="bold" icon="bold" label="Bold" />
      <MarkButton format="italic" icon="italic" label="Italic" />
      <MarkButton format="underline" icon="underline" label="Underline" />
      <MarkButton
        format="strikethrough"
        icon="strikethrough"
        label="Strikethrough"
      />
      <BlockButton format="paragraph" icon="paragraph" label="Paragraph" />
      <BlockButton format="heading-six" icon="heading" label="Heading 6" />
      <BlockButton format="heading-five" icon="heading" label="Heading 5" />
      <BlockButton format="heading-four" icon="heading" label="Heading 4" />
      <BlockButton format="heading-three" icon="heading" label="Heading 3" />
      <BlockButton format="heading-two" icon="heading" label="Heading 2" />
      <BlockButton format="heading-one" icon="heading" label="Heading 1" />
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

const Button = (props) => {
  const { icon, label, active, disabled, onMouseDown } = props;

  return (
    <button
      title={label}
      aria-label={label}
      onMouseDown={onMouseDown}
      disabled={disabled}
      class={
        "btn mr-1" +
        (disabled
          ? " disabled text-muted"
          : active
          ? " text-light bg-dark"
          : " text-dark bg-light")
      }
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
    </button>
  );
};

const UndoButton = (props) => {
  const editor = useSlate();

  return (
    <Button
      disabled={editor.history.undos.length === 0}
      icon="undo"
      label="Undo"
      onMouseDown={(event) => {
        event.preventDefault();
        HistoryEditor.undo(editor);
      }}
      {...props}
    />
  );
};

const RedoButton = (props) => {
  const editor = useSlate();

  return (
    <Button
      disabled={editor.history.redos.length === 0}
      icon="redo"
      label="Redo"
      onMouseDown={(event) => {
        event.preventDefault();
        HistoryEditor.redo(editor);
      }}
      {...props}
    />
  );
};

const MarkButton = (props) => {
  const { format } = props;
  const editor = useSlate();

  return (
    <Button
      active={FlowEditor.isMarkActive(editor, format)}
      label="Mark"
      onMouseDown={(event) => {
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
    <Button
      active={FlowEditor.isBlockActive(editor, format)}
      label="Block"
      onMouseDown={(event) => {
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
    <Button
      active={FlowEditor.isAlignActive(editor, format)}
      label="Align"
      onMouseDown={(event) => {
        event.preventDefault();
        FlowEditor.toggleAlign(editor, format);
      }}
      {...props}
    />
  );
};

library.add(
  faUndo,
  faRedo,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
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
