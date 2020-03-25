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
    Breadcrumb,
    BreadcrumbItem,
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
    faAlignJustify
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

    toggleAlign(editor, align) {
        const isActive = FlowEditor.isAlignActive(editor, align)
        Transforms.setNodes(editor, {
            align: isActive ? null : align
        }, {
            match: n => Editor.isBlock(editor, n)
        })
    }
}

const Flow = () => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [value, setValue] = useState(JSON.parse(localStorage.getItem('content')) || [
        {
            type: 'paragraph',
            align: 'text-left',
            children: [{ text: '' }],
        },
    ])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    const renderElement = useCallback(props => {
        return <Element {...props} />
    }, [])

    return (
        <Slate
            editor={editor}
            value={value}
            onChange={value => {
                setValue(value)
                const content = JSON.stringify(value)
                localStorage.setItem('content', content)
            }}
        >
            <Tools className='d-print-none sticky-top bg-light' />
            <Editable className='p-5'
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                spellCheck
                autoFocus
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
                            case '`': {
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
            return <div className={element.align} {...attributes}>{children}</div>
    }
}

const Tools = props => {
    return (
        <div {...props}>
            <MarkButton format='bold' icon={faBold} />
            <MarkButton format='italic' icon={faItalic} />
            <MarkButton format='underline' icon={faUnderline} />
            <MarkButton format='strikethrough' icon={faStrikethrough} />
            <MarkButton format='code' icon={faCode} />
            <MarkButton format='subscript' icon={faSubscript} />
            <MarkButton format='superscript' icon={faSuperscript} />
            <BlockButton format='paragraph' icon={faParagraph} />
            <BlockButton format='heading-one' icon={faHeading} />
            <AlignButton format='text-left' icon={faAlignLeft} />
            <AlignButton format='text-center' icon={faAlignCenter} />
            <AlignButton format='text-right' icon={faAlignRight} />
            <AlignButton format='text-justify' icon={faAlignJustify} />
            <Breadcrumb>
                <BreadcrumbItem href='#'>Storage</BreadcrumbItem>
                <BreadcrumbItem href='#' active>content</BreadcrumbItem>
            </Breadcrumb>
        </div>
    )
}

const FormatButton = ({ isActive, toggleFormat, format, icon, label}, props) => {
    const editor = useSlate()
    return (
        <Button {...props}
            aria-label={format}
            className='rounded-0 border-0'
            variant='outline-primary'
            active={isActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleFormat(editor, format)
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                fixedWidth
            />
            {label}
        </Button>
    )
}

const BlockButton = ({ format, icon, label }, props) => {
    return (
        <FormatButton {...props}
            isActive={FlowEditor.isBlockActive}
            toggleFormat={FlowEditor.toggleBlock}
            format={format}
            icon={icon}
            label={label}
        />
    )
}

const MarkButton = ({ format, icon, label }, props) => {
    return (
        <FormatButton {...props}
            isActive={FlowEditor.isMarkActive}
            toggleFormat={FlowEditor.toggleMark}
            format={format}
            icon={icon}
            label={label}
        />
    )
}

const AlignButton = ({ format, icon, label }, props) => {
    return (
        <FormatButton {...props}
            isActive={FlowEditor.isAlignActive}
            toggleFormat={FlowEditor.toggleAlign}
            format={format}
            icon={icon}
            label={label}
        />
    )
}

ReactDOM.render(<Flow />, document.getElementById('editor'))

// If you want your editor to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// See the serviceWorker.js script for details.
serviceWorker.unregister()
