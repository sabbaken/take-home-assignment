import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { CountriesContent } from './CountriesContent';
import { useCountries } from './use-countries';

/** The `countries` lookup table. No filters here — the point is to see what the employees table filters by. */
export function CountriesPage() {
  const countries = useCountries();

  const count: RowCount = countries.isPending
    ? 'loading'
    : countries.isError
      ? null
      : countries.data.length;

  return (
    <>
      <PageHeader title="Countries" noun={['country', 'countries']} count={count} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <CountriesContent query={countries} />
      </main>
    </>
  );
}
