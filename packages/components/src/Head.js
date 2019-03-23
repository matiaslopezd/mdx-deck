import React, { useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'

export const HeadContext = React.createContext({
  tags: [],
  push: () => {
    console.warn('Missing HeadProvider')
  },
})

export const HeadProvider = ({ tags = [], children }) => {
  const push = elements => {
    tags.push(...elements)
  }
  const context = { push }
  return <HeadContext.Provider value={context}>{children}</HeadContext.Provider>
}

export const Head = props => {
  const didMount = typeof document !== 'undefined'
  const context = useContext(HeadContext)
  const children = React.Children.toArray(props.children).map(child =>
    React.cloneElement(child, {
      'data-head': true,
    })
  )

  useEffect(() => {
    const nodes = [...document.head.querySelectorAll('[data-head]')]
    nodes.forEach(node => {
      node.remove()
    })
  }, [children])

  if (!didMount) {
    context.push(children)
    return false
  }

  return createPortal(props.children, document.head)
}

export default Head
