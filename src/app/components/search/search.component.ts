import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  value: string | null = ''

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  search(e: any) {
    this.router.navigate([''],
      {
        queryParams: {search: e.target.value || null},
        queryParamsHandling: ''
      })
  }


  ngOnInit(): void {
    this.value = this.route.snapshot.queryParamMap.get('search')
  }

  ngOnDestroy() {

  }
}
