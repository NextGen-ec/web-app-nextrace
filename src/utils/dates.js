const formatDate = (date, withTime = false) => {
    const fomattedDate =
      date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4);
    const parts = date.split('T');
    const fomattedTime = withTime ? parts[1].slice(0, 5) : '';
    return `${fomattedDate} ${fomattedTime}`;
  };

  export { formatDate };