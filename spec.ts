import { genPaths } from './';

type Continents =
  | 'antarctica'
  | 'asia'
  | 'africa'
  | 'australia'
  | 'north america'
  | 'south america'
  | 'europe';

describe('genPaths', () => {
  it('gens basic paths with root', () => {
    const countryRoutes = {
      countryId: (_countryId: string) => ({
        states: {
          stateId: (_stateId: string) => null, // null because no children
        },
      }),
    };

    const paths = {
      continents: {
        continent: (_continent: Continents) => ({ countries: countryRoutes }),
        population: { min: (_min: number) => null },
      },
      countries: countryRoutes,
    };

    const routes = genPaths(paths);

    expect(routes.root).toEqual('/');
    expect(routes.continents.continent('africa').root).toEqual('/continents/africa');
    expect(routes.continents.population.min(1_000_000).root).toEqual('/continents/population/1000000');
    expect(routes.countries.countryId().root).toEqual('/countries/:countryId');
    expect(routes.countries.countryId('{id}').root).toEqual('/countries/{id}');
    expect(routes.countries.countryId('{id}').states.stateId('{stateId}').root).toEqual(
      '/countries/{id}/states/{stateId}'
    );

    if (!true) {
      // @ts-expect-error
      routes.continents.continent('africaa').root;
      // @ts-expect-error
      const _route: string = routes.continents.continent('africaa');
      // @ts-expect-error
      routes.continents.deadlink;
      // @ts-expect-error
      routes.population('test');
    }
  });
});
