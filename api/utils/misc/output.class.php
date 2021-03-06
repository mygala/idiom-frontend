<?php

    class Output {

        function __construct() {

        }

        /**
         * 输出接口请求结果
         *
         * @param int $code
         * @param any $extends
         * @param bool $o
         * @param bool $isJsonp
         * @return string
         */
        public static function r($code, $extends = null, $o = false, $jsonp = "") {
            $output = null;

            $output['code']   = $code;
            $output['desc']   = self::getDesc($code);

            if ($extends || is_array($extends)) {

                // 数据长度
                $output['number'] = count($extends);

                if ($output['number']) {
                    $output['extend'] = $extends;
                }
            }

            $json = self::toJson($output);

            if($jsonp && strlen($jsonp) > 0) {
                $json = $jsonp . "(" . $json . ")";
            }

            if ($o) {
                echo $json;
                return null;
            } else {
                return $json;
            }
        }

        /**
         * 转化成JSON
         *
         * @param any $x
         * @return string
         */
        private function toJson($x) {
            return json_encode($x);
        }

        /**
         * 获取描述信息
         *
         * @param int $code
         * @return string
         */
        private function getDesc($code) {

            switch ($code) {
                case SUCCESS:
                    $desc = SUCCESS_DESC;
                    break;
                case SYSTEM_ERROR:
                    $desc = SYSTEM_ERROR_DESC;
                    break;
                case PARAM_ERROR:
                    $desc = PARAM_ERROR_DESC;
                    break;
                case ACCOUNT_PASSWORD_ERROR:
                    $desc = ACCOUNT_PASSWORD_ERROR_DESC;
                    break;
                case SIGNATURE_ERROR:
                    $desc = SIGNATURE_ERROR_DESC;
                    break;
                default:
                    $desc = INVALID_ERROR_DESC;
            }

            return $desc;
        }
    }