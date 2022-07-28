import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cost'
})
export class CostPipe implements PipeTransform {

  transform(value: number, ...args: any[]): string {
    return new Array(value).fill(null).map(() => '₽').join('');
  }

}
