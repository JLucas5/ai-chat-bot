import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from '../App';
import { it, expect } from 'vitest';

describe('App', () => {

  
  global.fetch = vi.fn()

  function createFetchResponse(data) {
    return { json: () => new Promise((resolve) => resolve(data)) }
  }

  it('renders the App component', async () => {
    render(<App />)

    expect(screen.getByText('Chat AI')).toBeInTheDocument()

  })
  
  it('opens the Chat Bot', async () => {
    const user = userEvent.setup()
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />)

    await user.click(screen.getByRole('button', {name: 'Chat AI'}))

    expect(screen.getByText('Chat with AI') && screen.getByText('Chat List')).toBeVisible()

  })

  it('creates a new chat', async ()=> {
    const user = userEvent.setup()
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />)

    await user.click(screen.getByRole('button', {name: 'Chat AI'}))

    await user.click(screen.getByTestId('create-button'))

    const headings = screen.getAllByRole('heading')

    expect(headings.length).toBe(4)
  })

  it('deletes a chat', async ()=> {
    const user = userEvent.setup()
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />)

    await user.click(screen.getByRole('button', {name: 'Chat AI'}))

    await user.click(screen.getAllByTestId('delete-button')[0])

    const headings = screen.getAllByRole('heading')

    expect(headings.length).toBe(3)

  })

  it('send a message', async ()=> {
    const user = userEvent.setup()
    window.HTMLElement.prototype.scrollIntoView = function() {};
    render(<App />)

    const fetchData = {
      choices:[{
        message: {
          content:'Test response.'}
      }]
    }
    
    global.fetch.mockResolvedValueOnce(createFetchResponse(fetchData))

    await user.click(screen.getByRole('button', {name: 'Chat AI'}))

    await user.type(screen.getByRole('textbox'), 'Hello, how are you?')

    await user.click(screen.getAllByTestId('submit-button')[0])

    expect(screen.getByText('Test response.')).toBeVisible()

  })
})