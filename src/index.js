import React, {
    useMemo,
    useState,
    useCallback
} from "react";

import ReactDOM from 'react-dom'

import {
    createEditor,
    Transforms,
    Editor
} from 'slate'

import {
    Slate,
    useSlate,
    Editable,
    withReact
} from 'slate-react'

import {
    withHistory
} from 'slate-history'

import {
    Button
} from 'react-bootstrap'

import {
    FontAwesomeIcon
} from '@fortawesome/react-fontawesome'

import {
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
    faUndo,
    faRedo,
    faServer
} from '@fortawesome/free-solid-svg-icons'

import * as serviceWorker from './serviceWorker.js'
import './index.scss';

const FlowEditor = {
    isMarkActive(editor, format) {
        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    },

    isBlockActive(editor, format) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === format,
        })

        return !!match
    },

    isAlignActive(editor, align) {
        const [match] = Editor.nodes(editor, {
            match: n => n.align === align,
        })

        return !!match
    },

    toggleMark(editor, format) {
        const isActive = FlowEditor.isMarkActive(editor, format)
        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    },

    toggleBlock(editor, format) {
        const isActive = FlowEditor.isBlockActive(editor, format)
        Transforms.setNodes(editor, {
            type: isActive ? null : format
        }, {
            match: n => Editor.isBlock(editor, n)
        })
    },

    toggleAlign(editor, format) {
        const isActive = FlowEditor.isAlignActive(editor, format)
        Transforms.setNodes(editor, {
            align: isActive ? null : format
        }, {
            match: n => Editor.isBlock(editor, n)
        })
    }
}

const Flow = props => {
    const { file } = props
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [value, setValue] = useState(JSON.parse(localStorage.getItem(file)) || [{ children: [{ text: '' }] }])
    return (
        <Slate
            editor={editor}
            value={value}
            onChange={value => {
                setValue(value)
                localStorage.setItem(file, JSON.stringify(value))
            }}
        >
            <FlowTools className='d-print-none sticky-top bg-light' />
            <FlowEditable className='d-print-block d-print-p-0 p-5 bg-light' spellCheck autoFocus />
            <FlowStatus className='d-print-none pl-3 fixed-bottom bg-light' />
        </Slate>
    )
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    if (leaf.strikethrough) {
        children = <s>{children}</s>
    }

    if (leaf.subscript) {
        children = <sub>{children}</sub>
    }

    if (leaf.superscript) {
        children = <sup>{children}</sup>
    }

    return <span {...attributes}>{children}</span>
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'heading-one':
            return <h1 className={element.align} {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 className={element.align} {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 className={element.align} {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 className={element.align} {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 className={element.align} {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 className={element.align} {...attributes}>{children}</h6>
        case 'paragraph':
            return <p className={element.align} {...attributes}>{children}</p>
        default:
            return <div className={element.align + ' text-monospace'} {...attributes}>{children}</div>
    }
}

const FlowEditable = props => {
    const editor = useSlate()

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    const renderElement = useCallback(props => {
        return <Element {...props} />
    }, [])

    return (
        <Editable {...props}
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyDown={event => {
                if (event.ctrlKey) {
                    switch (event.key) {
                        case 'b': {
                            event.preventDefault()
                            FlowEditor.toggleMark(editor, 'bold')
                            break
                        }
                        case 'i': {
                            event.preventDefault()
                            FlowEditor.toggleMark(editor, 'italic')
                            break
                        }
                        case 'u': {
                            event.preventDefault()
                            FlowEditor.toggleMark(editor, 'underline')
                            break
                        }
                        case '~': {
                            event.preventDefault()
                            FlowEditor.toggleMark(editor, 'code')
                            break
                        }
                        default:
                            break
                    }
                }
            }}
        />
    )
}

const FlowStatus = props => {
    const editor = useSlate()
    const selection = editor.selection

    let ln = 1
    let col = 1
    let wordCount = -1
    let charCount = -1
    if (selection) {
        ln = selection.anchor.path[0] + 1
        col = selection.anchor.offset + 1
        const words = Editor.positions(editor, {
            at: editor.selection,
            unit: 'word'
        })
        const chars = Editor.positions(editor, {
            at: editor.selection,
            unit: 'character'
        })
        for (let _word of words) {
            wordCount++
        }
        for (let _char of chars) {
            charCount++
        }
    }

    return <div {...props}>At Line {ln}, Column {col}, {wordCount} Words and {charCount} Characters in selection</div>
}

const FlowTools = props => {
    const editor = useSlate()
    return (
        <div {...props}>
            <FlowButton disabled icon={faServer} onMouseDown={event => {
                event.preventDefault()
            }}
            />
            <FlowButton disabled={editor.history.undos.length === 0} icon={faUndo} onMouseDown={event => {
                event.preventDefault()
                editor.undo()
            }}
            />
            <FlowButton disabled={editor.history.redos.length === 0} icon={faRedo} onMouseDown={event => {
                event.preventDefault()
                editor.redo()
            }}
            />
            <MarkButton format='bold' icon={faBold} />
            <MarkButton format='italic' icon={faItalic} />
            <MarkButton format='underline' icon={faUnderline} />
            <MarkButton format='strikethrough' icon={faStrikethrough} />
            <MarkButton format='code' icon={faCode} />
            <MarkButton format='subscript' icon={faSubscript} />
            <MarkButton format='superscript' icon={faSuperscript} />
            <BlockButton format='paragraph' icon={faParagraph} />
            <BlockButton format='heading-one' icon={faHeading} label='lvl1' />
            <BlockButton format='heading-two' icon={faHeading} label='lvl2' />
            <BlockButton format='heading-three' icon={faHeading} label='lvl3' />
            <AlignButton format='text-left' icon={faAlignLeft} />
            <AlignButton format='text-center' icon={faAlignCenter} />
            <AlignButton format='text-right' icon={faAlignRight} />
            <AlignButton format='text-justify' icon={faAlignJustify} />
        </div>
    )
}

const FlowButton = props => {
    const { icon, label } = props
    return (
        <Button
            className='rounded-0 border-0'
            variant='outline-primary'
            {...props}
        >
            <FontAwesomeIcon
                icon={icon}
                fixedWidth
            />
            {label}
        </Button>
    )
}

const BlockButton = props => {
    const { format, icon, label } = props
    const editor = useSlate()
    return (
        <FlowButton
            icon={icon}
            label={label}
            active={FlowEditor.isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                FlowEditor.toggleBlock(editor, format)
            }}
            {...props}
        />
    )
}

const MarkButton = props => {
    const { format, icon, label } = props
    const editor = useSlate()
    return (
        <FlowButton
            icon={icon}
            label={label}
            active={FlowEditor.isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                FlowEditor.toggleMark(editor, format)
            }}
            {...props}
        />
    )
}

const AlignButton = props => {
    const { format, icon, label } = props
    const editor = useSlate()
    return (
        <FlowButton
            icon={icon}
            label={label}
            active={FlowEditor.isAlignActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                FlowEditor.toggleAlign(editor, format)
            }}
            {...props}
        />
    )
}

ReactDOM.render(<Flow file='content' />, document.getElementById('editor'))

// If you want your editor to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
serviceWorker.unregister()
