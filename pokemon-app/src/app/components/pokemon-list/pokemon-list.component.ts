import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemonList: any[] = [];
  filteredPokemonList: any[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe((data) => {
      this.pokemonList = data.results.map((pokemon: any, index: number) => ({
        ...pokemon,
        id: index + 1,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          index + 1
        }.png`,
      }));
      this.filteredPokemonList = this.pokemonList;
    });
  }

  filterPokemonList(searchTerm: any) {
    this.filteredPokemonList = this.pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
