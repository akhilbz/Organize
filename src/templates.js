import React from "react";

function AllTemplates() {
    return (
        <>
        <template id="group_template">
      <div className="col-md-4 mb-2">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4 className="title card-title header-text">
                Category
              </h4>           
              <button>Settings</button>
          </div>
        </div>
      </div>
      </template>
      <template id="block_template">
        <div className="col-md-4 mb-2">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4 className="title card-title header-text">
                Category
              </h4>           
              <button className="group">Settings</button>
            </div>
            <ul className="list-group list-group-flush"></ul>
          </div>
        </div>
      </template>

      <template id="li_template">
        <li className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <a>
              <h5 className="sub-title card-subtitle tab-text-size">
                Tab Title
              </h5>
            </a>
            <button className="close btn">Close</button>
          </div>
        </li>
      </template>
      </>
    )
}

export default AllTemplates;