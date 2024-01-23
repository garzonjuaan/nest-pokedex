import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-responde.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){}


  async executeSeed() {

    await this.pokemonModel.deleteMany({})
    
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100')

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(({name, url}) => {

        const segments = url.split('/');
        const no = +segments [ segments.length - 2 ];

        pokemonToInsert.push({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed Executed'
     

    
    // const insertPromiseArray = [];

    // data.results.forEach( async ({name, url}) => {

    //   const segments = url.split('/');
    //   const no = +segments [ segments.length - 2 ];

    //   insertPromiseArray.push(
    //     this.pokemonModel.create({ name, no })
    //   )
  
    // });
    
    // await Promise.all( insertPromiseArray )
    //   return 'Seed Executed';
   

  }


  // async deleteSeed() {
  //   await this.pokemonModel.deleteMany({})
  // }

}
