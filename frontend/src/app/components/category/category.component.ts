import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Category, CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  catSubscription$: Subscription;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategoriesFromServer();
    this.catSubscription$ = this.categoryService
      .getCategoriesUpdateListener()
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  displayCategory(index: number) {
    const category = this.categories[index];
    this.router.navigate([`${category.id}`, 'products']);
    this.productService.getProductsFromServer(category.id, 5, 1);
  }

  addCategory() {
    this.dialog.open(DialogComponent, {
      data: { type: 'category', edit: false },
    });
  }

  editCategory(index: number) {
    const category = this.categories[index];
    this.dialog.open(DialogComponent, {
      data: {
        type: 'category',
        edit: true,
        name: category.name,
        categoryId: category.id,
      },
    });
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategoryOnServer(id);
  }

  ngOnDestroy(): void {
    if (this.catSubscription$) this.catSubscription$.unsubscribe();
  }
}
