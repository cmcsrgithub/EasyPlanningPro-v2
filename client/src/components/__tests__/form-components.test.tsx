import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

// Wrapper component for form testing
function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('Form Components', () => {
  describe('Select Component', () => {
    it('should render select with placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should open dropdown when trigger is clicked', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);
      
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeVisible();
        expect(screen.getByText('Option 2')).toBeVisible();
      });
    });

    it('should select an option', async () => {
      const handleChange = vi.fn();
      
      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);
      
      await waitFor(() => {
        const option1 = screen.getByText('Option 1');
        fireEvent.click(option1);
      });
      
      expect(handleChange).toHaveBeenCalledWith('opt1');
    });

    it('should display selected value', () => {
      render(
        <Select value="opt2">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
      
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Checkbox Component', () => {
    it('should render checkbox', () => {
      render(<Checkbox id="test-checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should toggle checkbox on click', () => {
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should be checked when checked prop is true', () => {
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
    });

    it('should be unchecked when checked prop is false', () => {
      render(<Checkbox checked={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should render with label', () => {
      render(
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      );
      
      expect(screen.getByText('Accept terms and conditions')).toBeInTheDocument();
    });
  });

  describe('Textarea Component', () => {
    it('should render textarea', () => {
      render(<Textarea placeholder="Enter description" />);
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('should handle text input', () => {
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Test text' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should display value prop', () => {
      render(<Textarea value="Initial text" onChange={() => {}} />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe('Initial text');
    });

    it('should support multiline text', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      render(<Textarea value={multilineText} onChange={() => {}} />);
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(textarea.value).toBe(multilineText);
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should apply rows attribute', () => {
      render(<Textarea rows={5} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('should apply maxLength attribute', () => {
      render(<Textarea maxLength={100} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });
  });

  describe('Label Component', () => {
    it('should render label text', () => {
      render(<Label>Username</Label>);
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should associate with input using htmlFor', () => {
      render(
        <div>
          <Label htmlFor="email-input">Email</Label>
          <input id="email-input" type="email" />
        </div>
      );
      
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', 'email-input');
    });

    it('should apply custom className', () => {
      render(<Label className="custom-label">Custom Label</Label>);
      const label = screen.getByText('Custom Label');
      expect(label).toHaveClass('custom-label');
    });
  });

  describe('Form Validation', () => {
    it('should display required field error', async () => {
      const TestForm = () => {
        const { register, handleSubmit, formState: { errors } } = useForm();
        
        return (
          <form onSubmit={handleSubmit(() => {})}>
            <input {...register('email', { required: 'Email is required' })} />
            {errors.email && <span role="alert">{errors.email.message as string}</span>}
            <button type="submit">Submit</button>
          </form>
        );
      };
      
      render(<TestForm />);
      
      fireEvent.click(screen.getByText('Submit'));
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
      });
    });

    it('should validate email format', async () => {
      const TestForm = () => {
        const { register, handleSubmit, formState: { errors } } = useForm();
        
        return (
          <form onSubmit={handleSubmit(() => {})}>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <span role="alert">{errors.email.message as string}</span>}
            <button type="submit">Submit</button>
          </form>
        );
      };
      
      render(<TestForm />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'invalid-email' } });
      fireEvent.click(screen.getByText('Submit'));
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
      });
    });
  });
});

