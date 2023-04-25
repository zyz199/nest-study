/*
 Navicat Premium Data Transfer

 Source Server         : test1
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : nest-study

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 02/02/2023 15:25:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(255) NOT NULL COMMENT '部门名称',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0 禁用; 1启用',
  `avatar` varchar(255) DEFAULT NULL COMMENT '部门头像',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `create_user` bigint NOT NULL COMMENT '创建人',
  `update_user` bigint NOT NULL COMMENT '修改人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='部门信息表';

-- ----------------------------
-- Records of department
-- ----------------------------
BEGIN;
INSERT INTO `department` VALUES (1, '研发部门', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-01-28 15:28:00', '2023-01-28 15:28:00', 1, 1);
INSERT INTO `department` VALUES (2, '研发01', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:53:59', '2023-02-01 14:53:59', 1, 1);
INSERT INTO `department` VALUES (3, '研发02', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:03', '2023-02-01 14:54:03', 1, 1);
INSERT INTO `department` VALUES (4, '研发03', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:11', '2023-02-01 14:54:11', 1, 1);
INSERT INTO `department` VALUES (5, '研发04', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:15', '2023-02-01 14:54:15', 1, 1);
INSERT INTO `department` VALUES (6, '研发05', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:20', '2023-02-01 14:54:20', 1, 1);
INSERT INTO `department` VALUES (7, '研发06', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:25', '2023-02-01 14:54:25', 1, 1);
INSERT INTO `department` VALUES (8, '研发07', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:30', '2023-02-01 14:54:30', 1, 1);
INSERT INTO `department` VALUES (9, '研发08', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:35', '2023-02-01 14:54:35', 1, 1);
INSERT INTO `department` VALUES (10, '研发09', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/ba1337e7-34f5-45a9-b55c-2d379e9f5a37.jpg', '2023-02-01 14:54:40', '2023-02-01 14:54:40', 1, 1);
INSERT INTO `department` VALUES (12, '研发10', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/5539df3f-db62-4fd1-bc02-f11e9395b7e1.jpg', '2023-02-01 14:56:07', '2023-02-01 14:56:07', 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for employee
-- ----------------------------
DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(255) NOT NULL COMMENT '用户姓名',
  `birthday` datetime NOT NULL COMMENT '用户生日',
  `gender` varchar(2) NOT NULL COMMENT '用户性别 0 男 1 女',
  `id_number` varchar(18) NOT NULL COMMENT '身份证号码',
  `phone` varchar(11) NOT NULL COMMENT '手机号',
  `username` varchar(64) NOT NULL COMMENT '账户名称-登陆时的账号',
  `password` varchar(64) NOT NULL COMMENT '账户密码',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0:禁用，1:正常',
  `avatar` varchar(255) NOT NULL COMMENT '头像',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `create_user` bigint NOT NULL COMMENT '创建人',
  `update_user` bigint NOT NULL COMMENT '修改人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `id_number` (`id_number`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='员工信息表';

-- ----------------------------
-- Records of employee
-- ----------------------------
BEGIN;
INSERT INTO `employee` VALUES (1, '超级管理员', '2000-01-01 00:00:00', '0', '130725111111111111', '13333333333', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 1, 'https://tse4-mm.cn.bing.net/th/id/OIP-C.y2CeSO5xZJ1SjSskl1dqzwHaEo?w=279&h=180&c=7&r=0&o=5&dpr=2&pid=1.7', '2023-01-13 10:57:00', '2023-02-02 10:34:49', 1, 1);
INSERT INTO `employee` VALUES (2, '员工01', '2003-01-01 00:00:00', '0', '111111111111111111', '18888888888', 'user1', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:57:25', '2023-02-01 14:57:25', 1, 1);
INSERT INTO `employee` VALUES (3, '员工02', '2003-01-01 00:00:00', '0', '211111111111111111', '18888888888', 'user2', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:57:33', '2023-02-01 14:57:33', 1, 1);
INSERT INTO `employee` VALUES (4, '员工03', '2003-01-01 00:00:00', '0', '311111111111111111', '18888888888', 'user3', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:57:46', '2023-02-01 14:57:46', 1, 1);
INSERT INTO `employee` VALUES (5, '员工04', '2003-01-01 00:00:00', '0', '411111111111111111', '18888888888', 'user4', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:57:55', '2023-02-01 14:57:55', 1, 1);
INSERT INTO `employee` VALUES (6, '员工05', '2003-01-01 00:00:00', '0', '511111111111111111', '18888888888', 'user5', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:58:05', '2023-02-01 14:58:05', 1, 1);
INSERT INTO `employee` VALUES (8, '员工06', '2003-01-01 00:00:00', '0', '611111111111111111', '18888888888', 'user6', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:58:16', '2023-02-01 14:58:16', 1, 1);
INSERT INTO `employee` VALUES (9, '员工07', '2003-01-01 00:00:00', '0', '711111111111111111', '18888888888', 'user7', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:58:28', '2023-02-01 14:58:28', 1, 1);
INSERT INTO `employee` VALUES (10, '员工08', '2003-01-01 00:00:00', '0', '811111111111111111', '18888888888', 'user8', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:58:40', '2023-02-01 14:58:40', 1, 1);
INSERT INTO `employee` VALUES (11, '员工09', '2003-01-01 00:00:00', '0', '911111111111111111', '18888888888', 'user9', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:58:54', '2023-02-01 14:58:54', 1, 1);
INSERT INTO `employee` VALUES (12, '员工10', '2003-01-01 00:00:00', '0', '101111111111111111', '18888888888', 'user10', 'e10adc3949ba59abbe56e057f20f883e', 1, 'http://nest-study-backend.oss-cn-hangzhou.aliyuncs.com/2023/02/01/d1769499-1690-434e-b030-049882fe23eb.jpg', '2023-02-01 14:59:06', '2023-02-01 14:59:06', 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for organization
-- ----------------------------
DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(255) DEFAULT NULL COMMENT '组织架构名',
  `sort` int DEFAULT NULL COMMENT '组织架构顺序',
  `d_id` bigint DEFAULT NULL COMMENT '部门ID',
  `e_id` bigint DEFAULT NULL COMMENT '员工ID',
  `p_id` bigint DEFAULT NULL COMMENT '父级ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `create_user` bigint NOT NULL COMMENT '创建人',
  `update_user` bigint NOT NULL COMMENT '修改人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COMMENT='组织架构表';

-- ----------------------------
-- Records of organization
-- ----------------------------
BEGIN;
INSERT INTO `organization` VALUES (1, '研发部门', 3, 1, NULL, 0, '2023-02-01 14:52:50', '2023-02-01 15:01:26', 1, 1);
INSERT INTO `organization` VALUES (2, NULL, NULL, NULL, 1, 1, '2023-02-01 14:53:15', '2023-02-01 14:53:15', 1, 1);
INSERT INTO `organization` VALUES (3, '研发01', 1, 2, NULL, 0, '2023-02-01 14:55:01', '2023-02-01 15:01:26', 1, 1);
INSERT INTO `organization` VALUES (4, '研发02', 2, 3, NULL, 3, '2023-02-01 14:55:14', '2023-02-01 15:01:26', 1, 1);
INSERT INTO `organization` VALUES (5, '研发03', 4, 4, NULL, 3, '2023-02-01 14:56:26', '2023-02-01 14:56:42', 1, 1);
INSERT INTO `organization` VALUES (6, '研发04', 5, 5, NULL, 3, '2023-02-01 14:56:32', '2023-02-01 14:56:42', 1, 1);
INSERT INTO `organization` VALUES (7, NULL, NULL, NULL, 2, 1, '2023-02-01 15:01:35', '2023-02-01 15:01:35', 1, 1);
INSERT INTO `organization` VALUES (8, NULL, NULL, NULL, 3, 1, '2023-02-01 15:01:44', '2023-02-01 15:01:44', 1, 1);
INSERT INTO `organization` VALUES (9, NULL, NULL, NULL, 4, 1, '2023-02-01 15:01:49', '2023-02-01 15:01:49', 1, 1);
INSERT INTO `organization` VALUES (10, NULL, NULL, NULL, 5, 1, '2023-02-01 15:01:53', '2023-02-01 15:01:53', 1, 1);
INSERT INTO `organization` VALUES (11, NULL, NULL, NULL, 6, 1, '2023-02-01 15:01:57', '2023-02-01 15:01:57', 1, 1);
INSERT INTO `organization` VALUES (12, NULL, NULL, NULL, 8, 1, '2023-02-01 15:02:02', '2023-02-01 15:02:02', 1, 1);
INSERT INTO `organization` VALUES (13, NULL, NULL, NULL, 12, 4, '2023-02-01 15:02:28', '2023-02-01 15:02:28', 1, 1);
INSERT INTO `organization` VALUES (14, NULL, NULL, NULL, 11, 4, '2023-02-01 15:02:31', '2023-02-01 15:02:31', 1, 1);
INSERT INTO `organization` VALUES (15, NULL, NULL, NULL, 10, 4, '2023-02-01 15:02:36', '2023-02-01 15:02:36', 1, 1);
INSERT INTO `organization` VALUES (16, NULL, NULL, NULL, 9, 4, '2023-02-01 15:02:40', '2023-02-01 15:02:40', 1, 1);
INSERT INTO `organization` VALUES (17, NULL, NULL, NULL, 8, 4, '2023-02-01 15:02:44', '2023-02-01 15:02:44', 1, 1);
INSERT INTO `organization` VALUES (18, NULL, NULL, NULL, 6, 4, '2023-02-01 15:02:50', '2023-02-01 15:02:50', 1, 1);
INSERT INTO `organization` VALUES (19, NULL, NULL, NULL, 10, 5, '2023-02-01 15:03:03', '2023-02-01 15:03:03', 1, 1);
INSERT INTO `organization` VALUES (20, NULL, NULL, NULL, 1, 6, '2023-02-01 15:03:09', '2023-02-01 15:03:09', 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for track_log
-- ----------------------------
DROP TABLE IF EXISTS `track_log`;
CREATE TABLE `track_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `module_name` varchar(30) NOT NULL COMMENT '模块名称',
  `module_time` datetime NOT NULL COMMENT '模块时间',
  `num` int DEFAULT '1' COMMENT '访问量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='跟踪记录表';

-- ----------------------------
-- Records of track_log
-- ----------------------------
BEGIN;
INSERT INTO `track_log` VALUES (3, '员工管理', '2023-02-01 02:46:17', 16);
INSERT INTO `track_log` VALUES (5, '组织架构', '2023-02-01 02:46:19', 15);
INSERT INTO `track_log` VALUES (6, '部门管理', '2023-02-01 02:47:32', 23);
INSERT INTO `track_log` VALUES (7, '员工管理', '2023-02-02 10:34:30', 8);
INSERT INTO `track_log` VALUES (8, '部门管理', '2023-02-02 10:34:30', 6);
INSERT INTO `track_log` VALUES (9, '组织架构', '2023-02-02 10:34:31', 3);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
