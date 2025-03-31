import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number = 50): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=${limit}`);
  }

  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`).pipe(
      catchError((error) => {
        console.error('Error fetching Pokémon:', error);
        return throwError(() => new Error('Could not fetch Pokémon details.'));
      })
    );
  }
}
