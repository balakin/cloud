const INFORMATION_CONTAINER_CLASS_NAME = "information-container";

async function applicationRequestInterceptor(request) {
  let token = getCookieValue("CSRF-TOKEN");
  if (!token) {
    await fetch("/api/v1/antiforgery", {
      credentials: "include",
    });
    token = getCookieValue("CSRF-TOKEN");
  }

  request.headers["X-CSRF-TOKEN"] = token;
  return request;
}

function applicationResponseInterceptor(response) {
  (async () => {
    try {
      const viewerResponse = await fetch("/api/v1/users/@me", {
        credentials: "include",
      });
      if (viewerResponse.ok) {
        const viewer = await viewerResponse.json();
        setAuthorized(viewer.userName);
      } else {
        setUnauthorized();
      }
    } catch (error) {
      setUnauthorized();
    }
  })();

  return response;
}

const logoutButton = document.createElement("button");
logoutButton.className = "btn cancel api-logout-btn";
logoutButton.innerText = "Logout";
logoutButton.onclick = () => {
  (async () => {
    logoutButton.disabled = true;
    try {
      const response = await fetch("/api/v1/auth/logout", {
        credentials: "include",
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": getCookieValue("CSRF-TOKEN"),
        },
      });
      if (response.ok) {
        setUnauthorized();
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.log(error);
    } finally {
      logoutButton.disabled = false;
    }
  })();
};

function setAuthorized(userName) {
  const authSection = initAuthSection();
  authSection.innerText = `${userName}`;
  authSection.appendChild(logoutButton);
}

function setUnauthorized() {
  const authSection = initAuthSection();
  authSection.innerText = "Unauthorized. Use auth endpoints for authorization.";
}

function setErrorOccurred() {
  const authSection = initAuthSection();
  authSection.innerText = "Unauthorized. Error occurred.";
}

const initAuthSection = (() => {
  let authSection;

  return () => {
    if (authSection) {
      authSection.remove();
    }

    const informationContainer = document.getElementsByClassName(
      INFORMATION_CONTAINER_CLASS_NAME
    )[0];
    authSection = document.createElement("div");
    authSection.innerHTML;
    authSection.className = "wrapper api-auth-info";
    informationContainer.after(authSection);
    return authSection;
  };
})();

function getCookieValue(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
