

const uniqueDates = [
  ...new Set(messageStore.map((item) => item.createdAt.split("T")[0])),
];

{uniqueDates.map((dates, index) => (
  <>
    <span key={index}></span>
    {messageStore.map((item, i) => {
      if (item.createdAt.split("T")[0] === dates) {
        return (
          <div key={i} className="flex">
            {isSameSender(
              messageStore,
              item,
              i,
              user.user._id
            ) ||
            isLastMessage(messageStore, i, user.user._id) ? (
              <span className="profile">
                <img
                  src={item?.sender.avatar}
                  alt="pic"
                  loading="lazy"
                  className="h-6 w-6 sm:h-12 sm:w-12  rounded-full "
                />
              </span>
            ) : (
              <div className="profile"></div>
            )}
            <span
              className={`my-1 ${
                user.user._id === item?.sender._id
                  ? "message own ml-auto"
                  : "message rounded-[16px]"
              } ${
                isSameSender(
                  messageStore,
                  item,
                  i,
                  user.user._id
                ) ||
                isLastMessage(messageStore, i, user.user._id)
                  ? "rounded-tl-none"
                  : null
              }`}
            >
              {isSameSender(
                messageStore,
                item,
                i,
                user.user._id
              ) ||
              isLastMessage(messageStore, i, user.user._id) ? (
                <span
                  className={`text-[#000] font-semibold text-base ${
                    user.user._id === item?.sender._id
                      ? "hidden"
                      : "inline"
                  }`}
                >
                  {item?.sender.firstName} &nbsp;
                  {item?.sender.lastName}{" "}
                </span>
              ) : null}
              <span className="px-1 text-md">
                {item?.content}
              </span>

              <span className="text-right text-[#000] font-semibold text-base">
                {new Date(item?.createdAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </span>
            </span>
          </div>
        );
      }
      return null;
    })}

    <div className="flex justify-center items-center relative">
      <TimeFormate TimeData={dates} />
    </div>
  </>
))}