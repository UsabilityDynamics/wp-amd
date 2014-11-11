<div class="hotel-widget">
  <form action="#">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-3">
          <div class="start-date-container clearfix">
            <div class="resp-wrapper">
              <input type="text" class="start-date" name="start-date" placeholder="From">
            </div>
            <span class="icon-date"></span>
          </div>
        </div>

        <div class="col-xs-12 col-md-3">
          <div class="end-date-container clearfix">
            <div class="resp-wrapper">
              <input type="text" class="end-date" name="end-date" placeholder="To">
            </div>
            <span class="icon-date"></span>
          </div>
        </div>

        <div class="col-xs-12 col-md-3">
          <div class="hotel-type-container">
            <select name="hotel-type" class="custom-select hotel-type">
              <option value="hotel">Hotel</option>
              <option value="package">Hotel + Ticket</option>
            </select>
          </div>
        </div>

        <div class="col-xs-12 col-md-3">
          <div class="select-container hotel-room-1-container">
            <select name="hotel-room-1" id="hotel-room-1" class="custom-select hotel-room-1">
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
              <option value="5">5 people</option>
            </select>
          </div>
        </div>

        <input type="hidden" name="hotel-rooms" class="hotel-rooms" value="1" />
        <?php /** Depreciating for now, until George's refactor
        <div class="col-xs-12 col-md-3">
          <div class="hotel-rooms-container">
            <select name="hotel-rooms" class="custom-select hotel-rooms">
              <option value="select-rooms">Select Rooms</option>
              <option value="1">1 room</option>
              <option value="2">2 rooms</option>
              <option value="3">3 rooms</option>
              <option value="4">4 rooms</option>
            </select>
          </div>
        </div>
      </div> */ ?>

      <div class="row validation-error">
        <div class="col-xs-12">
          <em>Validation error goes here</em>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-4 col-md-offset-4">
          <div class="button-container">
            <a href="#" class="search-button button">Search Now</a>
          </div>
        </div>
      </div>
    </div>

    <div class="hotel-rooms-overlay overlay">
      <div class="overlay-content">

        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <h3>Select how many people you want in the rooms</h3>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-3">
              <label for="hotel-room-1">Room 1</label>

              <?php /** Depreciating for now, until George's refactor
              <div class="select-container hotel-room-1-container">
                <select name="hotel-room-1" id="hotel-room-1" class="custom-select hotel-room-1">
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                </select>
              </div> */ ?>
            </div>

            <div class="col-xs-12 col-md-3">
              <label for="hotel-room-2">Room 2</label>

              <div class="select-container hotel-room-2-container">
                <select name="hotel-room-2" id="hotel-room-2" class="custom-select hotel-room-2">
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                </select>
              </div>
            </div>

            <div class="col-xs-12 col-md-3">
              <label for="hotel-room-3">Room 3</label>

              <div class="select-container hotel-room-3-container">
                <select name="hotel-room-3" id="hotel-room-3" class="custom-select hotel-room-3">
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                </select>
              </div>
            </div>

            <div class="col-xs-12 col-md-3">
              <label for="hotel-room-4">Room 4</label>

              <div class="select-container hotel-room-4-container">
                <select name="hotel-room-4" id="hotel-room-4" class="custom-select hotel-room-4">
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-3 col-md-offset-3">
              <div class="button-container">
                <a href="#" class="ok-button button">OK</a>
              </div>
            </div>
            <div class="col-xs-12 col-md-3">
              <div class="button-container">
                <a href="#" class="search-button button">Search Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg"></div>
    </div>
  </form>
</div>