import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AnimalList from './AnimalList';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AnimalList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the search input and button', () => {
        render(<AnimalList />);
        expect(screen.getByPlaceholderText(/search for an animal/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    test('fetches and displays animals on search', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ name: 'Lion', characteristics: { habitat: 'Savannah', diet: 'Carnivore' } }],
        });

        render(<AnimalList />);

        fireEvent.change(screen.getByPlaceholderText(/search for an animal/i), {
            target: { value: 'Lion' },
        });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText(/loading animals/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/lion/i)).toBeInTheDocument();
            expect(screen.getByText(/add to favorites/i)).toBeInTheDocument();
        });
    });

    test('adds animal to favorites', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ name: 'Elephant', characteristics: { habitat: 'Grassland', diet: 'Herbivore' } }],
        });

        render(<AnimalList />);

        fireEvent.change(screen.getByPlaceholderText(/search for an animal/i), {
            target: { value: 'Elephant' },
        });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            fireEvent.click(screen.getByText(/add to favorites/i));
            expect(screen.getByText(/favorite animals/i)).toBeInTheDocument();
            expect(screen.getByText(/elephant/i)).toBeInTheDocument();
        });
    });

    test('removes animal from favorites', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ name: 'Tiger', characteristics: { habitat: 'Rainforest', diet: 'Carnivore' } }],
        });

        render(<AnimalList />);

        fireEvent.change(screen.getByPlaceholderText(/search for an animal/i), {
            target: { value: 'Tiger' },
        });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            fireEvent.click(screen.getByText(/add to favorites/i));
        });

        await waitFor(() => {
            expect(screen.getByText(/favorite animals/i)).toBeInTheDocument();
            fireEvent.click(screen.getByText(/remove/i));
            expect(screen.queryByText(/tiger/i)).not.toBeInTheDocument();
        });
    });

    test('renders the AnimalRating component when an animal is selected', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ name: 'Giraffe', characteristics: { habitat: 'Savannah', diet: 'Herbivore' } }],
        });

        render(<AnimalList />);

        fireEvent.change(screen.getByPlaceholderText(/search for an animal/i), {
            target: { value: 'Giraffe' },
        });
        fireEvent.click(screen.getByRole('button', { name: /search/i }));

        await waitFor(() => {
            fireEvent.click(screen.getByText(/add to favorites/i));
            fireEvent.click(screen.getByText(/rate/i));
            expect(screen.getByText(/rate/i)).toBeInTheDocument();
        });
    });
});
