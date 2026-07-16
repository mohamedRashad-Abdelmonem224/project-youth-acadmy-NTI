import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  position = 'all';

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // نزامن قيمة الفلتر مع الـ query params لو المستخدم فتح رابط فيه فلتر جاهز
    this.route.queryParamMap.subscribe((params) => {
      this.position = params.get('position') || 'all';
    });
  }

  goTop10() {
    this.position = 'all';
    this.router.navigate(['/'], { queryParams: { view: 'top10' } });
  }

  goAll() {
    this.position = 'all';
    this.router.navigate(['/'], { queryParams: { view: 'all' } });
  }

  onFilterChange() {
    if (this.position === 'all') {
      this.goAll();
      return;
    }
    this.router.navigate(['/'], {
      queryParams: { view: 'all', position: this.position },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
