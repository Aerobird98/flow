import React, { useMemo, useState, useCallback } from "react";
import ReactDOM from 'react-dom'

import { createEditor, Transforms, Editor } from 'slate'
import { Slate, useSlate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import * as serviceWorker from './serviceWorker'

import './index.css'

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

    if (leaf.strike) {
        children = <s>{children}</s>
    }

    return <span {...attributes}>{children}</span>
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'unordered-list':
            return <ul {...attributes}>{children}</ul>
        case 'ordered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const WordifyEditor = {
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

    toggleMark(editor, format) {
        const isActive = WordifyEditor.isMarkActive(editor, format)

        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    },

    toggleBlock(editor, format) {
        const isActive = WordifyEditor.isBlockActive(editor, format)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : format },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
}

const Wordify = () => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])
    const [value, setValue] = useState(
        JSON.parse(localStorage.getItem('content'))
        ||
        [
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'A line of text in a paragraph.'
                    },
                ]
            }
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
            autoFocus
        >
            <div className='tools'>
                <BlockButton format='heading-one' label='H1' />
                <BlockButton format='heading-two' label='H2' />
                <BlockButton format='heading-three' label='H3' />
                <BlockButton format='heading-four' label='H4' />
                <BlockButton format='heading-five' label='H5' />
                <BlockButton format='heading-six' label='H6' />
                <BlockButton format='block-quote' label='Blockquote' />
            </div>
            <div className='tools'>
                <MarkButton format='bold' label='Bold' />
                <MarkButton format='italic' label='Italic' />
                <MarkButton format='underline' label='Underline' />
                <MarkButton format='strike' label='Strikethrough' />
                <MarkButton format='code' label='Code' />
            </div>
            <Editable
                renderLeaf={renderLeaf}
                renderElement={renderElement}
                onKeyDown={event => {
                    if (!event.ctrlKey) {
                        return
                    }

                    switch (event.key) {
                        case '1': {
                            event.preventDefault()
                            WordifyEditor.toggleBlock(editor, 'heading-one')
                            break
                        }
                        case '2': {
                            event.preventDefault()
                            WordifyEditor.toggleBlock(editor, 'heading-two')
                            break
                        }
                        case '3': {
                            event.preventDefault()
                            WordifyEditor.toggleBlock(editor, 'heading-three')
                            break
                        }
                        case '4': {
                            event.preventDefault()
                            WordifyEditor.toggleBlock(editor, 'heading-four')
                            break
                        }
                        case '5': {
                            event.preventDefault()
                            WordifyEditor.toggleBlock(editor, 'heading-five')
                            break
                        }
                        case '6': {
                            event.preventDefault()
                            WordifyEditor.toggleBlock(editor, 'heading-six')
                            break
                        }
                        case 'b': {
                            event.preventDefault()
                            WordifyEditor.toggleMark(editor, 'bold')
                            break
                        }
                        case 'i': {
                            event.preventDefault()
                            WordifyEditor.toggleMark(editor, 'italic')
                            break
                        }
                        case '`': {
                            event.preventDefault()
                            WordifyEditor.toggleMark(editor, 'code')
                            break
                        }
                        default:
                            break
                    }
                }}
            />
        </Slate>
    )
}

const BlockButton = ({ format, label }) => {
    const editor = useSlate()
    return (
        <span className={'btn' + (WordifyEditor.isBlockActive(editor, format) ? ' active' : ' disabled')}
            onMouseDown={event => {
                event.preventDefault()
                WordifyEditor.toggleBlock(editor, format)
            }}
        >
            {label}
        </span>
    )
}

const MarkButton = ({ format, label }) => {
    const editor = useSlate()
    return (
        <span className={'btn' + (WordifyEditor.isMarkActive(editor, format) ? ' active' : ' disabled')}
            onMouseDown={event => {
                event.preventDefault()
                WordifyEditor.toggleMark(editor, format)
            }}
        >
            {label}
        </span>
    )
}

ReactDOM.render(<Wordify />, document.getElementById('wordify'))

// If you want your editor to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
serviceWorker.unregister()
