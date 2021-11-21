export async function HandleGetCommand(commandId) {
    const requestOptions = {
        method: 'GET',
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      };
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/command/' + commandId, requestOptions);
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
  export async function handleCreateCommand (event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestOptions = {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      body: JSON.stringify({
        resourceType: parseInt(data.get("resourceType")),
        operationType: parseInt(data.get("operationType")),
        value: data.get("value"),
        operationDurationMinutes: parseInt(data.get("operationDurationMinutes"))
    })
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/command', requestOptions);
        if (response.status != 201) {
          return "not_done";
        }
        return "done";
    } catch (err) {
        return "error";
    }
  }

  export async function handleUpdateCommand (commandId, event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestOptions = {
      method: 'PUT',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      body: JSON.stringify({
        resourceType: parseInt(data.get("resourceType")),
        operationType: parseInt(data.get("operationType")),
        value: data.get("value"),
        operationDurationMinutes: parseInt(data.get("operationDurationMinutes"))
    })
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/command/' + commandId, requestOptions);
        if (response.status != 204) {
          return "not_done";
        }
        return "done";
    } catch (err) {
        return "error";
    }
  }

  export async function handleDeleteCommand (commandId) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/command/' + commandId, requestOptions);
        if (response.status != 204) {
          return "not_done";
        }
        return "done";
    } catch (err) {
        return "error";
    }
  }
  

  export async function HandleCommandsLoad() {
    {
        const requestOptions = {
          method: 'GET',
          headers: { 
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        };
        try {
          const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/command', requestOptions);
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