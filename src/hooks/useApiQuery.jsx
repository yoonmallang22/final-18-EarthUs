/* eslint-disable no-console */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRecoilState } from "recoil";

import privateDataAtom from "../recoil/privateDataAtom";
import BASE_URL from "../utils/config";

/**
 * @returns API서버에서 데이터 출력
 * @example const { data } = useApiQuery(url, "get");
 */
export default function useApiQuery(apiUrl, method, body = null) {
  // token을 가져오기 위한 privateDataAtom 사용
  const [privateData] = useRecoilState(privateDataAtom);
  const token = privateData || "";

  const executeQuery = async () => {
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const res = await axios({
      url: BASE_URL + apiUrl,
      method: "",
      headers,
      data: body,
    });
    console.log("요청에 성공했습니다.");
    console.table(res.data);

    return res.data;
  };

  const { isLoading, error, data } = useQuery(
    [apiUrl, method, body],
    executeQuery,
    // 브라우저 화면을 이탈했다가 다시 포커스할 때 refetch 방지
    { refetchOnWindowFocus: false },
  );
  if (isLoading) {
    console.warn("요청 실행 중...");
  }
  if (error) {
    console.error("요청에 실패했습니다.");
  }

  return { isLoading, error, data };
}

// ✅ Usage
// const { data } = useApiQuery(
//   '/url',        // API 주소
//   'get',         // get ...
// );
