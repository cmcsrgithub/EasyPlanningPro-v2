import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

describe('UI Components', () => {
  describe('Button Component', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render different button variants', () => {
      const { rerender } = render(<Button variant="default">Default</Button>);
      expect(screen.getByText('Default')).toBeInTheDocument();

      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByText('Destructive')).toBeInTheDocument();

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByText('Outline')).toBeInTheDocument();

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByText('Ghost')).toBeInTheDocument();
    });

    it('should render different button sizes', () => {
      const { rerender } = render(<Button size="default">Default Size</Button>);
      expect(screen.getByText('Default Size')).toBeInTheDocument();

      rerender(<Button size="sm">Small</Button>);
      expect(screen.getByText('Small')).toBeInTheDocument();

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByText('Large')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByText('Disabled Button');
      expect(button).toBeDisabled();
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      fireEvent.click(screen.getByText('Disabled'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should render as child element when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByText('Link Button');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Input Component', () => {
    it('should render input field', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should handle input changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test input' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should display value prop', () => {
      render(<Input value="Initial value" onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Initial value');
    });

    it('should support different input types', () => {
      const { rerender } = render(<Input type="text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

      rerender(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<Input type="password" />);
      const passwordInput = document.querySelector('input[type="password"]');
      expect(passwordInput).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should apply custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Dialog (Modal) Component', () => {
    it('should render dialog trigger', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      
      expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    });

    it('should open dialog when trigger is clicked', async () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>
      );
      
      fireEvent.click(screen.getByText('Open Dialog'));
      
      await waitFor(() => {
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
        expect(screen.getByText('Dialog content')).toBeInTheDocument();
      });
    });

    it('should close dialog when close button is clicked', async () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>
      );
      
      // Open dialog
      fireEvent.click(screen.getByText('Open Dialog'));
      
      await waitFor(() => {
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      });
      
      // Close dialog (look for close button)
      const closeButton = screen.getByRole('button', { name: /close/i });
      if (closeButton) {
        fireEvent.click(closeButton);
        
        await waitFor(() => {
          expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
        });
      }
    });

    it('should render dialog with custom content', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Custom Dialog</DialogTitle>
            </DialogHeader>
            <div data-testid="custom-content">
              <p>Custom paragraph</p>
              <Button>Custom Button</Button>
            </div>
          </DialogContent>
        </Dialog>
      );
      
      expect(screen.getByText('Custom Dialog')).toBeInTheDocument();
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Button')).toBeInTheDocument();
    });
  });
});

