import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import {
  PokemonBasicInfo,
  PokemonListResponse,
} from '../../utils/pokemon.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CapitalizePipe } from '../../utils/capitalize.pipe';

@Component({
  selector: 'app-pokemon-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    CapitalizePipe,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  dataSource = new MatTableDataSource<PokemonBasicInfo>();
  #apiUrl: string = '';
  #initialUrl: string = 'https://pokeapi.co/api/v2/pokemon';
  dataPokemon: PokemonListResponse = {
    results: [],
    next: '',
    previous: '',
    count: 0,
  };
  displayedColumns: string[] = ['id', 'name', 'sprite'];

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.#apiUrl = this.#initialUrl;
    this._callServiceList();
  }

  private _callServiceList() {
    const idCounter = this._getOffsetFromUrl(this.#apiUrl);
    this.pokemonService.getPokemonList(this.#apiUrl).subscribe((data) => {
      this.dataPokemon = data;
      this.dataSource.data = data.results.map(
        (pokemon: PokemonBasicInfo, index: number) => ({
          ...pokemon,
          id: idCounter + index + 1,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            idCounter + index + 1
          }.png`,
        })
      );
    });
  }

  getPage(_event: PageEvent) {
    const previousPageIndex = _event.previousPageIndex ?? -1;
    this.#apiUrl =
      _event.pageIndex > previousPageIndex
        ? this.dataPokemon.next
        : this.dataPokemon.previous;
    this._callServiceList();
  }

  private _getOffsetFromUrl(url: string): number {
    const urlParams: URLSearchParams = new URL(url).searchParams;
    return Number(urlParams.get('offset')) || 0;
  }

  applyFilter(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    inputValue ? this._filterPokemon(inputValue) : this._callServiceList();
  }

  private _filterPokemon(searchValue: string) {
    this.pokemonService.getPokemonDetails(searchValue).subscribe({
      next: (data) => {
        this.dataSource.data = [
          {
            name: data.name,
            id: data.order,
            sprite: data.sprites.front_default,
            url: data.species.url,
          },
        ];
      },
      error: () => {
        console.log('Pokemon not found');
      },
    });
  }

  goToDetail(name: string) {
    this.router.navigate(['/pokemon', name]);
  }
}
