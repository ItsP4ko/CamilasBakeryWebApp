import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResponsiveTable from './ResponsiveTable';

describe('ResponsiveTable Component', () => {
    const mockColumns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
    ];

    const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
    ];

    const mockKeyExtractor = (row: any) => row.id;

    it('should render data rows correctly', () => {
        render(
            <ResponsiveTable
                columns={mockColumns}
                data={mockData}
                keyExtractor={mockKeyExtractor}
            />
        );

        expect(screen.getAllByText('Item 1').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Item 2').length).toBeGreaterThan(0);
    });

    it('should render pagination controls when paging props are provided and totalPages > 1', () => {
        render(
            <ResponsiveTable
                columns={mockColumns}
                data={mockData}
                keyExtractor={mockKeyExtractor}
                currentPage={1}
                totalPages={5}
                onPageChange={vi.fn()}
            />
        );

        expect(screen.getByText('Página 1 de 5')).toBeInTheDocument();
        expect(screen.getByText('Anterior')).toBeInTheDocument();
        expect(screen.getByText('Siguiente')).toBeInTheDocument();
    });

    it('should NOT render pagination controls when totalPages is 1', () => {
        render(
            <ResponsiveTable
                columns={mockColumns}
                data={mockData}
                keyExtractor={mockKeyExtractor}
                currentPage={1}
                totalPages={1}
                onPageChange={vi.fn()}
            />
        );

        expect(screen.queryByText('Página 1 de 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
        expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    });

    it('should call onPageChange with correct page when "Siguiente" is clicked', () => {
        const onPageChangeMock = vi.fn();
        render(
            <ResponsiveTable
                columns={mockColumns}
                data={mockData}
                keyExtractor={mockKeyExtractor}
                currentPage={1}
                totalPages={5}
                onPageChange={onPageChangeMock}
            />
        );

        const nextButton = screen.getByText('Siguiente');
        fireEvent.click(nextButton);

        expect(onPageChangeMock).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with correct page when "Anterior" is clicked', () => {
        const onPageChangeMock = vi.fn();
        render(
            <ResponsiveTable
                columns={mockColumns}
                data={mockData}
                keyExtractor={mockKeyExtractor}
                currentPage={2}
                totalPages={5}
                onPageChange={onPageChangeMock}
            />
        );

        const prevButton = screen.getByText('Anterior');
        fireEvent.click(prevButton);

        expect(onPageChangeMock).toHaveBeenCalledWith(1);
    });

    it('should disable "Anterior" button on first page', () => {
        render(
            <ResponsiveTable
                columns={mockColumns}
                data={mockData}
                keyExtractor={mockKeyExtractor}
                currentPage={1}
                totalPages={5}
                onPageChange={vi.fn()}
            />
        );

        const prevButton = screen.getByText('Anterior');
        expect(prevButton).toBeDisabled();
    });

    it('should disable "Siguiente" button on last page', () => {
        render(
            <ResponsiveTable
                columns={mockColumns}
                data={mockData}
                keyExtractor={mockKeyExtractor}
                currentPage={5}
                totalPages={5}
                onPageChange={vi.fn()}
            />
        );

        const nextButton = screen.getByText('Siguiente');
        expect(nextButton).toBeDisabled();
    });
});
