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
  faUndo,
  faRedo,
  faPrint,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faRemoveFormat,
  faParagraph,
  faHeading,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faLink,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

import "typeface-quicksand";
import "./app.scss";

// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//import * as serviceWorker from "./serviceWorker.js";

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
    const isCollapsed = FlowEditor.isSelectionCollapsed(editor);
    const [match] = Editor.nodes(editor, {
      match: (n) => n[format] === true,
    });

    return isCollapsed ? false : !!match;
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

  isSelectionCollapsed(editor) {
    const { selection } = editor;
    return selection && Range.isCollapsed(selection);
  },

  toggleMark(editor, format) {
    const active = FlowEditor.isMarkActive(editor, format);
    const isCollapsed = FlowEditor.isSelectionCollapsed(editor);

    if (!isCollapsed) {
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

  insertLink(editor, url, text) {
    if (url) {
      Transforms.insertNodes(editor, {
        type: "link",
        url: url,
        children: [{ text: text ? text : url }],
      });
    }
  },

  insertImage(editor, url) {
    if (url) {
      Transforms.insertNodes(editor, {
        type: "image",
        url: url,
        children: [{ text: "" }],
      });
    }
  },

  openFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  },

  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },

  isfullscreenActive() {
    return !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  },

  toggleFullscreen() {
    if (FlowEditor.isfullscreenActive()) {
      FlowEditor.closeFullscreen();
    } else {
      FlowEditor.openFullscreen();
    }
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
  const { isVoid, isInline } = editor;

  editor.isVoid = (element) => {
    switch (element.type) {
      case "image":
        return true;
      default:
        return isVoid(element);
    }
  };

  editor.isInline = (element) => {
    switch (element.type) {
      case "link":
        return true;
      default:
        return isInline(element);
    }
  };

  return editor;
};

const Flow = (props) => {
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
    case "link":
      return (
        <a
          class={element.align}
          href={element.url}
          title={element.url}
          {...attributes}
        >
          {children}
        </a>
      );
    case "image":
      return (
        <div class={element.align + " mb-3"}>
          <img
            class="img-fluid rounded"
            src={element.url}
            title={element.url}
            alt="image"
            {...attributes}
          >
            {children}
          </img>
        </div>
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
    const ON_MAC = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
    const key = event.key;
    const modKey = ON_MAC ? event.metaKey : event.ctrlKey;
    const altKey = event.altKey;

    if (modKey) {
      if (altKey) {
        switch (key) {
          case "f":
            event.preventDefault();
            FlowEditor.toggleFullscreen();
            break;
          case "0":
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "paragraph");
            break;
          case "1":
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-one");
            break;
          case "2":
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-two");
            break;
          case "3":
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-three");
            break;
          case "4":
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-four");
            break;
          case "5":
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-five");
            break;
          case "6":
            event.preventDefault();
            FlowEditor.toggleBlock(editor, "heading-six");
            break;
          default:
            break;
        }
      } else {
        switch (key) {
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
          case "u":
            event.preventDefault();
            FlowEditor.toggleMark(editor, "underline");
            break;
          case "s":
            event.preventDefault();
            FlowEditor.toggleMark(editor, "strikethrough");
            break;
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
      <FullscreenButton />
      <UndoButton />
      <RedoButton />
      <PrintButton />
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
      <LinkButton />
      <ImageButton />
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
          ? " disabled"
          : active
          ? " text-light bg-dark"
          : " text-dark bg-light")
      }
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
    </button>
  );
};

const FullscreenButton = (props) => {
  return (
    <Button
      icon="expand"
      label="Fullscreen"
      onMouseDown={(event) => {
        event.preventDefault();
        FlowEditor.toggleFullscreen();
      }}
      {...props}
    />
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

const PrintButton = (props) => {
  return (
    <Button
      icon="print"
      label="Print"
      onMouseDown={(event) => {
        event.preventDefault();
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
    <Button
      disabled={FlowEditor.isSelectionCollapsed(editor)}
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

const LinkButton = (props) => {
  const editor = useSlate();

  return (
    <Button
      icon="link"
      label="Link"
      onMouseDown={(event) => {
        event.preventDefault();
        FlowEditor.insertLink(
          editor,
          window.prompt("URL"),
          window.prompt("TEXT")
        );
      }}
      {...props}
    />
  );
};

const ImageButton = (props) => {
  const editor = useSlate();

  return (
    <Button
      icon="image"
      label="Image"
      onMouseDown={(event) => {
        event.preventDefault();
        FlowEditor.insertImage(editor, window.prompt("URL"));
      }}
      {...props}
    />
  );
};

library.add(
  faExpand,
  faUndo,
  faRedo,
  faPrint,
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faRemoveFormat,
  faParagraph,
  faHeading,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faLink,
  faImage
);

render(<Flow />, document.getElementById("app"));

// If you want your app to work offline and load faster, you can uncoment
// the code below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
//serviceWorker.register();
