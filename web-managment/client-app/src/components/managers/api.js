export async function HandleGetManager(managerId) {
    const requestOptions = {
        method: 'GET',
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      };
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/manager/' + managerId, requestOptions);
        if (response.status == 200) {
          const responseData = await response.json();
          return responseData.obj;
        } else if (response.status == 401) {
          return false;
        }
      } catch (err) {
          return false;
      }
  };
  export async function handleCreateManager (event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestOptions = {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      body: JSON.stringify({
        username: data.get("username"),
        name: data.get("name"),
        password: data.get("password"),
        email: data.get("email"),
    })
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/manager', requestOptions);
        if (response.status != 201) {
          return "not_done";
        }
        return "done";
    } catch (err) {
        return "error";
    }
  }

  export async function handleUpdateManager (managerId, event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestOptions = {
      method: 'PUT',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      body: JSON.stringify({
        username: data.get("username"),
        name: data.get("name"),
        email: data.get("email"),
    })
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/manager/' + managerId, requestOptions);
        if (response.status != 204) {
          return "not_done";
        }
        return "done";
    } catch (err) {
        return "error";
    }
  }

  export async function handleUpdateManagerPassword (managerId, event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestOptions = {
      method: 'PUT',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      body: JSON.stringify({
        password: data.get("password")
    })
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/manager/password/' + managerId, requestOptions);
        if (response.status != 204) {
          return "not_done";
        }
        return "done";
    } catch (err) {
        return "error";
    }
  }

  export async function HandleManagersLoad() {
    {
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        };
        try {
          const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/manager', requestOptions);
          if (response.status == 200) {
            const responseData = await response.json();
            return responseData;
          } else if (response.status == 401) {
            return false;
          }
        } catch (err) {
            return false;
        }
      }
  }
  export async function handleDeleteManager (managerId) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/manager/' + managerId, requestOptions);
        if (response.status != 204) {
          return "not_done";
        }
        return "done";
    } catch (err) {
        return "error";
    }
  }