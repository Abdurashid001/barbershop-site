const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'admin.html');

const modalHtml = `
    <!-- Booking Modal -->
    <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content bg-secondary text-light">
          <div class="modal-header border-0">
            <h5 class="modal-title text-primary text-uppercase" id="bookingModalLabel">Записаться в очередь</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="bookingForm">
                <div class="mb-3">
                    <label for="bookName" class="form-label">Ваше имя</label>
                    <input type="text" class="form-control bg-transparent text-white" id="bookName" required>
                </div>
                <div class="mb-3">
                    <label for="bookPhone" class="form-label">Телефон</label>
                    <input type="text" class="form-control bg-transparent text-white" id="bookPhone" required>
                </div>
                <div class="mb-3">
                    <label for="bookService" class="form-label">Услуга</label>
                    <select class="form-select bg-transparent text-white" id="bookService" style="background-color: #333 !important;" required>
                        <option value="Стрижка">Стрижка</option>
                        <option value="Бритье">Бритье</option>
                        <option value="Стрижка бороды">Стрижка бороды</option>
                        <option value="Комплекс (Стрижка + Борода)">Комплекс</option>
                    </select>
                </div>
                <div class="row">
                    <div class="col-6 mb-3">
                        <label for="bookDate" class="form-label">Дата</label>
                        <input type="date" class="form-control bg-transparent text-white" id="bookDate" required>
                    </div>
                    <div class="col-6 mb-3">
                        <label for="bookTime" class="form-label">Время</label>
                        <input type="time" class="form-control bg-transparent text-white" id="bookTime" required>
                    </div>
                </div>
                <div class="mb-3" id="bookMessage"></div>
                <button type="submit" class="btn btn-primary w-100 py-2">Подтвердить запись</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Booking Modal End -->
`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Replace the specific button if it hasn't been replaced yet
    const oldBtn = '<a href="" class="btn btn-primary rounded-0 py-2 px-lg-4 d-none d-lg-block">Записаться<i class="fa fa-arrow-right ms-3"></i></a>';
    const newBtn = '<a href="#" data-bs-toggle="modal" data-bs-target="#bookingModal" class="btn btn-primary rounded-0 py-2 px-lg-4 d-none d-lg-block">Записаться<i class="fa fa-arrow-right ms-3"></i></a>';
    
    if (content.includes(oldBtn)) {
        content = content.replace(oldBtn, newBtn);
    }
    
    // Add modal html before footer or before back to top if not exist
    if (!content.includes('id="bookingModal"')) {
        const insertTarget = '<!-- Back to Top -->';
        if (content.includes(insertTarget)) {
            content = content.replace(insertTarget, modalHtml + '\n' + insertTarget);
        } else {
            console.warn(`Could not find where to insert modal in ${file}`);
        }
    }

    fs.writeFileSync(path.join(dir, file), content);
    console.log(`Patched bookings for ${file}`);
});
